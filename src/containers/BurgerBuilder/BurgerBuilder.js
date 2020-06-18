import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENT_PRICES = {
    salad: 0.2,
    cheese: 0.1,
    meat: 1.1,
    bacon: 0.4
}


class BurgerBuilder extends Component {

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 2,
        purchasing : false,
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
        this.setState({purchasing: true}) 
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false}) 
    }

    purchaseContinueHandler = () => {
        alert("you qjd");
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }
        

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}
                        price={this.state.totalPrice}/>
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    ordered={this.purchaseHandler}
                    price={this.state.totalPrice}
                />

            </Aux>
        )
    }
}

export default BurgerBuilder;