// Core
import React, { PureComponent } from 'react';
import { func } from "prop-types";

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync:      func.isRequired,
        _updateSateAndDBAsync: func.isRequired,
    };

    _getTaskShape = ({
                         id = this.props.id,
                         completed = this.props.completed,
                         favorite = this.props.favorite,
                         message = this.props.message,
                     }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _getComplete = () => {
        const {
            completed,
        } = this.props;

        return (
            <Checkbox
                checked = { completed }
                className = { Styles._toggleTaskCompletedState }
                color1 = { '#3B8EF3' }
                color2 = { '#FFF' }
                onClick = { this._completeTask }
            />
        );
    };

    _completeTask = () => {
        const { _updateSateAndDBAsync, id } = this.props;

        _updateSateAndDBAsync(id, 'completed');
    };

    _getFavorite = () => {
        const {
            favorite,
        } = this.props;


        return (
            <Star
                checked = { favorite }
                className = { Styles.toggleTaskFavoriteState }
                color1 = { '#3B8EF3' }
                color2 = { '#000' }
                hover = { false }
                inlineBlock
                onClick = { this._favoriteTask }
            />
        );
    };
    _favoriteTask = () => {
        const { _updateSateAndDBAsync, id } = this.props;

        _updateSateAndDBAsync(id, 'favorite');

    };
    _getRemoveTask = () => {
        return (
            <Remove
                checked = { false }
                color1 = { '#3B8EF3' }
                color2 = { '#000' }
                inlineBlock
                onClick = { this._removeTask }
            />
        );
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };


    _getEditTask = () => {
        const { edited } = this.props;


        return (
            <Edit
                checked = { edited }
                className = { Styles.updateTaskMessageOnClick }
                color1 = { '#3B8EF3' }
                color2 = { '#000' }
                onClick = { this._setTaskEditingState }
            />
        );
    };

    _setTaskEditingState = () => {
        const {
            id,
            edited,
            // message,
            _updateSateAndDBAsync } = this.props;

        if (edited) {

            _updateSateAndDBAsync(id, 'message', this.input.value);
        }
        _updateSateAndDBAsync(id, 'edited');

    };

    _getInputTask = () => {
        const {
            edited,
            message,
        } = this.props;

        return (
            <div className = { Styles.toggleTaskCompletedState }>
                <input
                    defaultValue = { message }
                    disabled = { !edited }
                    maxLength = { 50 }
                    ref = { (input) => this.input = input }
                    type = 'text'
                    onKeyDown = { this._updateTaskMessageOnKeyDown }
                />
            </div>
        );
    };

    _updateTaskMessageOnKeyDown = (e) => {
        if (e.key === "Escape" || e.keyCode === 27|| e.which === 27) {
            const { message } = this.props;

            this.input.value = message;
            this._setTaskEditingState();
        }
        if (e.key === "Enter") {
            e.preventDefault();
            this._setTaskEditingState();
        }
    };

    render () {
        // const {
        //     id,
        //     message,
        //     edited,
        // } = this.props;
        const Complete = this._getComplete();
        const Input = this._getInputTask();
        const Favorite = this._getFavorite();
        const EditB = this._getEditTask();
        const RemoveTask = this._getRemoveTask();

        return (<li className = { Styles.task }>
            <div className = { Styles.content }>
                {Complete}
                {Input}
            </div>
            <div className = { Styles.actions }>
                {Favorite}
                {EditB}
                {RemoveTask}
            </div>
        </li>);
    }
}
