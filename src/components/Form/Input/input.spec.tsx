import React from "react";
import { render } from '@testing-library/react-native';

import { Input } from '.';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../../global/styles/theme';

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
)
    ;

describe('Input Component', () => {
    it('must have font family regular', () => {
        const { getByTestId, debug } = render(
            <Input
                testID="input-email"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCorrect={false}
            />,
            {
                wrapper: Providers
            }
        );

        debug();

        const inputComponent = getByTestId('input-email');
        expect(inputComponent.props.style[0].fontFamily).toEqual(theme.fonts.regular)


    })
})