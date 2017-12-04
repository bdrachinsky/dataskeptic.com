import React, { Component } from "react";
import Link from "../../components/Link";
import Icon from "react-fontawesome";
import styled from "styled-components";
import BlogList from "../../modules/Blogs/Containers/BlogWrapper";
import CategoryList from "../../modules/Blogs/Containers/CategoryList";
import Container from "../../components/Container";
import Page from "../../hoc/Page";
import { loadBlogList, loadCategories } from "../../redux/modules/blogReducer";

@Page
export default class Dashboard extends Component {
  static async getInitialProps({ store: { dispatch, getState }, query }) {
    const state = getState();
    const promises = [];
    promises.push(dispatch(loadBlogList()));
    promises.push(dispatch(loadCategories()));
    await Promise.all(promises);
  }

  render() {
    return (
      <Container>
        <Wrapper>
          <BlogList />
          <CategoryList />
        </Wrapper>
      </Container>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
`

const Title = styled.h1`
  color: red;
  text-align: center;
`;
