// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
import Spinner from '../Spinner';
// import Task from '../Task';
// import Checkbox from '../../theme/assets/Checkbox';

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

    render () {
        const { isTasksFetching, newTaskMessage, tasksFilter, tasks } = this.state;

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner
                        isTasksFetching = { isTasksFetching }
                    />
                    <header>
                        <h1 className = 'test'>Планировщик задач</h1>
                    </header>
                    <section>
                        <div>
                            <ul />
                        </div>

                    </section>
                    <footer />

                </main>
            </section>
        );
    }
}
