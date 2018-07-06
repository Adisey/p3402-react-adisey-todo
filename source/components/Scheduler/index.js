// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';
// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
import Spinner from '../Spinner';
import Task from '../Task';
import Checkbox from '../../theme/assets/Checkbox';

export default class Scheduler extends Component {
    state = {
        completeAll:     false,
        tasks:           [],
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }
    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _compareTwoTask = (firstTask, secondTask) =>
        firstTask.completed*10+!firstTask.favorite -(secondTask.completed*10+!secondTask.favorite);

    _sortTaskState = () =>
        this.setState(({ tasks }) => ({
            tasks: tasks.sort(
                this._compareTwoTask
            ),
        }));

    _getAllCompleted = () => {
        ///// !!!!!!!!!!!!!!!!!!!
        const { tasksFilter } = this.state;

        this.setState({
            completeAll: !this.state.tasks.
                filter((task) => task.message.toUpperCase().indexOf(tasksFilter.toUpperCase()) + 1).
                filter((task) => task.completed === false).length,
        });
        // console.log(`Check compleate! for filter - ${tasksFilter}`);
    };

    _updateTasksFilter = (e) => {
        const { value } = e.target;

        this.setState({ tasksFilter: value });
        // ToDo пока не понимаю, почему после передачи фильтра в стейт, не отрабатывает проверка на Комплит,
        // по отфильтрованному, Заернул в таймаут, но нужно спросить у Андрея
        setTimeout(() => {
            this._getAllCompleted();
        }, 300);
    };

    _updateNewTaskMessage = (e) => {
        const { value } = e.target;

        this.setState({ newTaskMessage: value });
    };
    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();

            this.setState({
                tasks,
            });
            this._sortTaskState();
            this._getAllCompleted();

        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
            console.log(`tasks`, this.state.tasks);
        }
    };
    _createTaskAsync = async () => {

    };

    _updateTaskAsync = async (updTask) => {
        try {
            this._setTasksFetchingState(true);
            await api.updateTask([updTask]);
        } catch (response) {
            console.error(response);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _setTaskEditingState = () => {

    };

    _completeAllTasksAsync = async () => {
        // Фековая функция исключительно для тестов, логика предусматривает другой алгоритм перевода
        // всех задач в статус выполнено ;)
        // В таком виде как есть можно использовать для обовления всех задач на сервере из стейта ;)
        const {
            tasks: updTasks,
        } = this.state;

        try {
            this._setTasksFetchingState(true);
            await api.completeAllTasks(updTasks);

        } catch ({ messageError }) {
            console.error(messageError);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _getCompleteAll = () => {
        const {
            completeAll,
        } = this.state;


        return (
            <div>
                <div>
                    <Checkbox
                        checked = { completeAll }
                        color1 = { '#3B8EF3' }
                        color2 = { '#FFF' }
                        onClick = { this._runCompleteAll }
                    />
                </div>
            </div>
        );
    };

    _getFilterInput = () => {
        const { tasksFilter } = this.props;

        return (
            <input
                placeholder = 'Поиск'
                type = 'search'
                value = { tasksFilter }
                onChange = { this._updateTasksFilter }
            />
        );
    };
    _getNewTaskInput = () => {
        const { newTaskMessage } = this.props;

        return (
            <form onSubmit = { this._createTaskAsync }>
                <input
                    className = 'createTask'
                    maxLength = { 50 }
                    placeholder = 'Описaние моей новой задачи'
                    type = 'text'
                    value = { newTaskMessage }
                    onChange = { this._updateNewTaskMessage }
                    onKeyPress = { this._keyPressNewTaskMessage }
                />
                <button>Добавить задачу</button>
            </form>);
    };
    _getTasks = () => {
        const { tasks, tasksFilter } = this.state;
        // const { tasks } = this.props;

        return (
            tasks.
                filter((task) => task.message.toUpperCase().indexOf(tasksFilter.toUpperCase())+1).
                map((task) => (
                    <Task
                        key = { task.id }
                        { ...task }
                    />
                ))
        );
    };

    render () {
        // const { isTasksFetching, newTaskMessage, tasksFilter, tasks } = this.state;
        const FilterInput = this._getFilterInput();
        const NewTaskInput = this._getNewTaskInput();
        const Tasks = this._getTasks();
        const CompleteAll = this._getCompleteAll();


        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner
                        isSpinning
                    />
                    <header>
                        <h1 className = 'test'>Планировщик задач</h1>
                        {FilterInput}
                    </header>
                    <section>
                        {NewTaskInput}
                        <div className = 'overlay' >
                            <ul><FlipMove>{Tasks}</FlipMove></ul>
                        </div>

                    </section>
                    <footer>
                        {CompleteAll}
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
