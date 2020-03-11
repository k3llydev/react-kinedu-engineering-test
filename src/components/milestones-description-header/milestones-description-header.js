import React, { Component } from 'react';
import styles from './milestones-description-header.scss';

class MilestonesDescriptionHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navigationButtons: [],
            currentAreaBackground: '',
            headerTitle: '',
            headerDescription: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headerTitle: nextProps.headerTitle,
            headerDescription: nextProps.headerDescription
        });  
    }

    render() {
        const {navigationButtons, currentAreaBackground, changedArea} = this.props;
        return(
            <header className={styles[currentAreaBackground]}>
                <h2 className={styles.TopHeader}>Areas</h2>
                <section className={styles.ButtonsContainer}>
                    {
                        navigationButtons.map((btn, index) => (
                            <button
                                key={index}
                                className={`${styles[btn.className]} ${btn.isActive ? styles.ActiveButton : ``}`}
                                onClick={changedArea}
                                id={index}
                            >
                                {btn.name}
                            </button>
                        ))
                    }
                </section>
                <hr className={styles.Divider} />
                <h1 className={styles.MainHeader}>Skill: {this.state.headerTitle}</h1>
                <p className={styles.Description}>{this.state.headerDescription}</p>
            </header>
        );
    }

}

export default MilestonesDescriptionHeader;