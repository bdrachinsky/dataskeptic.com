import React, { Component } from "react"
import styled from "styled-components"

const SubscriptionForm = () =>
    <Form action="//dataskeptic.us9.list-manage.com/subscribe/post?u=65e63d6f84f1d87759105d133&id=dc60d554db" method="post" target="_blank" novalidate>
        <Title>
            Enjoy this post? Sign up for our mailing list and don't miss any updates.
        </Title>
        <SubTitle>Subscribe to our mailing list</SubTitle>
        <FormWrap>
            <input name="EMAIL" component="input" type="text" placeholder="Email"/>
            <Submit type="submit">
                Submit
            </Submit>
        </FormWrap>
    </Form>;

export default SubscriptionForm;

const SubTitle = styled.div`
    color: #fff;
    font-size: 14px;
    text-align: left;
`;

const Form = styled.form`
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    background-color: #3a3b3b;
    padding: 0 10px 10px;
    margin: 80px 10px 10px;
`;

const FormWrap = styled.div`
    margin-top: 10px;
    & > input {
        font-size: 15px;
        display: block;
        margin-bottom: 10px;
        min-height: 32px;
        width: 100%;
        border-radius: 3px;
        padding: 0px;
        border: 1px solid black;
        padding: 0px 12px;
        box-sizing: border-box;
    }
    
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const Submit = styled.button`
    background-color: #aaa;
    border: 0 none;
    letter-spacing: .03em;
    -webkit-appearance: none;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    text-align: center;
    text-decoration: none;
    vertical-align: top;
    white-space: nowrap;
    width: auto;
    transition: all .23s ease-in-out 0s;
    
    &:hover {
        background-color: #777;
    }
`;

const Title = styled.div`
    font-size: 14pt;
    padding: 20px 0 0;
    text-align: center;
    color: #fff;
    margin-bottom: 20px;
`;
