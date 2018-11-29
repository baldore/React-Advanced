import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    const { id } = this.props;
    e.preventDefault();
    await updateItemMutation({
      variables: { id, ...this.state },
    });
  };

  render() {
    const { id } = this.props;

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (data.item == null) return <p>No item found for id {id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { error, loading }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.title}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.price}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a Description"
                        required
                        onChange={this.handleChange}
                        defaultValue={data.item.description}
                      />
                    </label>

                    <button type="submit">
                      Sav
                      {loading ? 'ing' : 'e'}
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

UpdateItem.propTypes = {
  id: PropTypes.string,
};

export default UpdateItem;
