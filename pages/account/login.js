import React, {Component} from "react";
import Container from "../../components/Container"
import Page from "../../hoc/Page";
import styled from 'styled-components'
import Ionicon from 'react-ionicons'

@Page
export default class Account extends Component {
    render() {
        return (
            <Container>
                <Wrapper>
                    <Description>
                        <Ionicon icon="md-lock" fontSize="35px" color="#666"/><br/>
                        Please login before accessing to this page.
                    </Description>
                    <GoogleLoginButton href={`/api/v1/auth/google`}>
                        <Ionicon icon="logo-google" fontSize="35px" color="#fff"/>
                        {' '}Continue with Google
                    </GoogleLoginButton>
                </Wrapper>
            </Container>
        );
    }
}

const Wrapper = styled.div`
    min-height: 400px;
    display: flex;
    flex-align: center;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Description = styled.p`
    color: #666;
    text-align: center;
`

const GoogleLoginButton = styled.a`
    background-color: #F2473C;
    color: #fff;
    :hover {
        color: #fff;
    }
    
    padding: 8px 10px;
    border-radius: 3px;
    
    display: flex;
    flex-align: center;
    align-items: center;
    justify-content: center;
`
