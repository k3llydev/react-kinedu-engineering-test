
import React, { Component } from 'react';
import styles from './milestones-skills-organism.scss';

class MilestonesSkillsOrganism extends Component {

    constructor(props) {
        super(props);
        this.state = {
            milestones: []
        }
    }

    /**
     * Handles state based on new props
     * @param {Object} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            milestones: nextProps.milestones,
            achievedRange: nextProps.achievedRange
        });  
    }

    /**
     * Handles the class that should be visible at the displayed milestone
     * @param {Boolean} answer 
     */
    _milestoneClass(answer) {
        if(answer === null) {
            return styles.NotAnswered
        }
        return answer ? styles.Completed : styles.Uncompleted;
    }

    /**
     * Handles the title for the currently shown milestone
     * @param {Boolean} answer 
     */
    _milestoneTitle(answer) {
        if(answer === null) {
            return 'Not answered';
        }
        return answer ? 'Completed' : 'Uncompleted';
    }

    /**
     * Rendering milestones
     */
    _milestoneRows() {
        const {changedMilestoneStatus, achievedRange} = this.props;
        const {milestones} = this.state;
        return milestones.map(milestone => (
            <article key={milestone.id} className={styles.ArticleContainer}>
                <div className={styles.TextsContainer}>
                    <h3>{milestone.title}</h3>
                    <span>Usually achieved by: {achievedRange} months</span>
                </div>
                <div className={styles.ButtonContianer}>
                    <button data-id={milestone.id} className={this._milestoneClass(milestone.answer)} onClick={changedMilestoneStatus}>{this._milestoneTitle(milestone.answer)}</button>
                </div>
            </article>
        ));
    }

    render() {
        return(
            <section className={styles.SkillsContainer}>
                {this._milestoneRows()}
            </section>
        );
    }

}

export default MilestonesSkillsOrganism;