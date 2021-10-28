import React from 'react';
import { Alert } from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignTitle,
    Footer,
    FooterWrapper,
} from './styles';


export function SignIn() {

    const { signInWithGoogle } = useAuth();

    async function handleSignInWithGoogle() {

        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error)
            Alert.alert('Não foi possível conectar a conta Google')
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        heigth={RFValue(68)}
                    />
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                    <SignTitle>
                        Faça seu login com {'\n'}
                        uma das contas abaixo
                    </SignTitle>
                </TitleWrapper>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title='Entrar com o Google'
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    <SignInSocialButton
                        title='Entrar com o Apple'
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    );
}