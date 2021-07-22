import React, { useState, useEffect } from 'react';

import {
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionType,
} from './styles';


import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório!'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico!')
        .positive('O valor não pode ser negativo!')
        .required('O valor é obrigatório!')
});

export function Register() {

    const [transactionType, setTransactionType] = useState('');

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',

    });

    const navigation = useNavigation();



    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionType(type: 'positive' | 'negative') {
        setTransactionType(type)
    }


    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal() {

        setCategoryModalOpen(false)
    }

    async function handleRegister(form: FormData) {

        if (!transactionType)
            return Alert.alert('Selecione o tipo de transação!')

        if (category.key === 'category')
            return Alert.alert('Selecione o tipo de categoria!')


        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',

            });
            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar');
        }

    }




    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>
                        Cadastro
                    </Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name='name'
                            control={control}
                            placeholder='Nome'
                            autoCapitalize='sentences'
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name='amount'
                            control={control}
                            placeholder='Preço'
                            keyboardType='numeric'
                            error={errors.amount && errors.amount.message}

                        />
                        <TransactionType>
                            <TransactionTypeButton
                                type='up'
                                title='Income'
                                onPress={() => handleTransactionType('positive')}
                                isActive={transactionType === 'positive'}
                            />
                            <TransactionTypeButton
                                type='down'
                                title='Outcome'
                                onPress={() => handleTransactionType('negative')}
                                isActive={transactionType === 'negative'}

                            />
                        </TransactionType>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title='Enviar'
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>
                <Modal
                    visible={categoryModalOpen}
                >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}