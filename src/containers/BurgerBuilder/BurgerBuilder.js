import React, { Component } from 'react';
import Aux from '../../hoc/Auxx';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-order';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.2,
    cheese: 0.1,
    meat: 1.1,
    bacon: 0.4
}


class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasing: false,
        loading: false,
        error: false,
    }

    componentDidMount() {
        axios.get('https://stage-udemy-big-burger.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({error: true})
            });
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = { ...this.state.ingredients };
        updatedIngredients[type] = this.state.ingredients[type] + 1;

        const updatedPrice = this.state.totalPrice + INGREDIENT_PRICES[type];

        this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice })
    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] === 0) {

        } else {
            const updatedIngredients = { ...this.state.ingredients };
            updatedIngredients[type] = this.state.ingredients[type] - 1;

            const updatedPrice = this.state.totalPrice - INGREDIENT_PRICES[type];

            this.setState({ ingredients: updatedIngredients, totalPrice: updatedPrice })
        }
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        //alert("you qjd");
        this.setState({ loading: true });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'JK',
                adresse: {
                    street: 'rue ...',
                    CodePostal: '75',
                    country: 'France'
                },
                email: 'jsnks@sndkfds.jdn',
                deleveryMethod: 'plane'
            }

        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({ loading: false, purchasing: false })
            })
            .catch(error => {
                this.setState({ loading: false, purchasing: false })
            })
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>ERROR</p> : <Spinner />


        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                    />
                </Aux>);

            orderSummary =
                <OrderSummary
                    ingredients={this.state.ingredients}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.state.totalPrice} />

            if (this.state.loading) {
                orderSummary = <Spinner />
            }

        }


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios);