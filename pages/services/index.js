import React, {Component} from 'react'
import {SERVICES} from "../../modules/Helpers/Contants";
import ServiceList from '../../modules/Services/Components/ServiceList'
import styled from 'styled-components'
import Page from '../../hoc/Page'
import Container from "../../components/Container"
import { Form } from "react-final-form"
import {contactFormValidator} from "../../modules/Forms/Validators";
import ContactForm from '../../modules/Forms/ContactForm'

@Page
export default class Services extends Component {
    static async getInitialProps({store: {dispatch, getState}, query}) {
        const state = getState()
        const promises = []

        await Promise.all(promises)
    }

    render() {
        return (
            <Container title={`Services`}>
                <ServiceWrapper>
                    <ServiceList
                        list={SERVICES}
                    />
                    <hr />
                    <Form onSubmit={(data) => alert(data)}
                          render={ContactForm}
                          subscription={{submitting: true, pristine: true}}
                          validate={values => contactFormValidator(values)}
                    />
                </ServiceWrapper>
            </Container>
        )
    }}


const ServiceWrapper = styled.div`
  max-width: 800px;
  margin:0 auto;
`