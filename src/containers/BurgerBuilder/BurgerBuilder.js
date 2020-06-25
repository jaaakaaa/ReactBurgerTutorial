import React, { Component } from 'react';
import Aux from '../../hoc/Auxx';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import axios from '../../axios-order';

class BurgerBuilder extends Component {

    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] === 0;
        }
        let orderSummary = null;
        let burger = this.props.error ? <p>ERROR</p> : <Spinner />


        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        ordered={this.purchaseHandler}
                        price={this.props.price}
                    />
                </Aux>);

            orderSummary =
                <OrderSummary
                    ingredients={this.props.ings}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.props.price} />

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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
}

const mapDispactchToProps = dispach => {
    return {
        onIngredientAdded: (igName) => dispach(actions.addIngredient(igName)),
        onIngredientRemoved: (igName) => dispach(actions.removeIngredient(igName)),
        onInitIngredients: () => dispach(actions.initIngredients()),
        onInitPurchase: () => dispach(actions.purchaseInit())
    }
}



export default connect(mapStateToProps, mapDispactchToProps)(withErrorHandler(BurgerBuilder,axios));