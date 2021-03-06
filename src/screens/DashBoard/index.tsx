import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React, { useState, useEffect, useCallback } from 'react';

import { ActivityIndicator } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';


import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useTheme } from 'styled-components';

import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighLightCards,
    Transations,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';


export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: HighLightProps
}

export function DashBoard() {

    const [isLoading, setIsLoading] = useState(true);

    const [transactions, setTransections] = useState<DataListProps[]>([]);

    const [highLightData, setHighLightData] = useState<HighLightData>({} as HighLightData);

    const theme = useTheme();

    const { signOut, user } = useAuth();

    function getLastTransaction(collection: DataListProps[],
        type: 'positive' | 'negative') {

        const collectionFilttered = collection
            .filter(transaction => transaction.type === type);

        if (collectionFilttered.length === 0)
            return 0;


        const lastTransaction = new Date(Math.max.apply(Math, collectionFilttered
            .map(transaction => new Date(transaction.date).getTime())))

        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;


    }

    async function loadTransactions() {

        const dataKey = `@gofinances:transactions_user:${user.id}`;

        const response = await AsyncStorage.getItem(dataKey);

        const transaction = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;


        const transactionFormatted: DataListProps[] = transaction
            .map((item: DataListProps) => {

                if (item.type === 'positive') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });


                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                }


            });

        setTransections(transactionFormatted);

        const lastTransactionEntries = getLastTransaction(transaction, 'positive');
        const lastTransactionExpensives = getLastTransaction(transaction, 'negative');

        const totalInterval = lastTransactionExpensives === 0
            ?
            'N??o h?? transa????es'
            : `01 a ${lastTransactionExpensives}`;


        const total = entriesTotal - expensiveTotal;


        setHighLightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0
                    ?
                    'N??o h?? transa????es'
                    : `??ltima entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0
                    ?
                    'N??o h?? transa????es'
                    : `??ltima sa??da dia ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,

            }
        })
        setIsLoading(false);
    }

    useEffect(() => {
        /* async function deleteAll() {
             AsyncStorage.removeItem('@gofinances:transactions')
         }
         deleteAll()*/
        loadTransactions()


    }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []))

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>

                        <ActivityIndicator
                            color={theme.colors.primary}
                            size='large'
                        />
                    </LoadContainer>
                    :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo
                                        source={{ uri: user.photo }}
                                    />
                                    <User>
                                        <UserGreeting>
                                            Ol??,
                                        </UserGreeting>
                                        <UserName>
                                            {user.name}
                                        </UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton onPress={signOut}>
                                    <Icon name='power' />
                                </LogoutButton>
                            </UserWrapper>
                        </Header>
                        <HighLightCards>
                            <HighlightCard
                                type='up'
                                title='Entradas'
                                amount={highLightData.entries.amount}
                                lastTransaction={highLightData.entries.lastTransaction}
                            />
                            <HighlightCard
                                type='down'
                                title='Sa??das'
                                amount={highLightData.expensives.amount}
                                lastTransaction={highLightData.expensives.lastTransaction}
                            />
                            <HighlightCard
                                type='total'
                                title='Total'
                                amount={highLightData.total.amount}
                                lastTransaction={highLightData.total.lastTransaction}
                            />

                        </HighLightCards>
                        <Transations>
                            <Title>
                                Listagem
                            </Title>
                            <TransactionList
                                data={transactions}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    <TransactionCard
                                        data={item}
                                    />
                                }

                            />

                        </Transations>
                    </>
            }
        </Container>
    );
}