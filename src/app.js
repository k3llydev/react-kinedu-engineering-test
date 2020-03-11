import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './fonts.css';
import styles from './main.scss';
import MilestonesDescriptionHeader from './components/milestones-description-header/milestones-description-header';
import MilestonesSkillsOrganism from './components/milestones-skills-organism/milestones-skills-organism';

const authToken = '09d23abf0c1d10e37592819dd8157ee06f22c0d308a8906d21e25c0de4f838859e0d5c1337aca40103b028ec81e948c6be382fce7c82d6ad273ad4fcd16e8f58';
const headers = new Headers({
  'Authorization': `Token token=${authToken}`
});

class Root extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      currentHeaderBackground: 'PhysicalArea',
      currentActiveButton: 0,
      bottomButtonMessage: 'Next',
      buttonDisabled: false,
      navigationButtons: [
        {
            name: 'Physical',
            className: 'ButtonPhysicalArea',
            backgroundClass: 'PhysicalArea',
            isActive: true,
            endpoint: 'http://demo.kinedu.com/api/v3/skills/2/milestones'
        },
        {
            name: 'Social & emotional',
            className: 'ButtonEmotionalArea',
            backgroundClass: 'EmotionalArea',
            endpoint: 'http://demo.kinedu.com/api/v3/skills/23/milestones'
        }
      ]
    };
  }

  /**
   * Method that handles the AJAX, by GET method to any provided API
   * @param {String} endpoint 
   * @return {Object}
   */
  async _fetchMilestonesData(endpoint) {
    return await fetch(endpoint, {
        method: 'GET',
        headers
    })
    .then(response=>response.json())
    .catch(error => alert(`A technical error ocurred:\n${error}`));
  }

  async componentDidMount() {
    const {navigationButtons, currentActiveButton} = this.state;
    const parsedButtons = navigationButtons.map(async button => {
      const response = await this._fetchMilestonesData(button.endpoint);
      return {
        ...button,
        ...response.data.skill
      };
    });
    const resolvedButtons = await Promise.all(parsedButtons);
    this.setState({
      navigationButtons: resolvedButtons,
      usuallyAchieved: resolvedButtons[currentActiveButton].age_range
    }, () => this.setState({isLoading: false}));
  }

  /**
   * Handles the updates caused by the change of area (top menu)
   * @param {Object} event 
   */
  _changedArea(event) {
    const {id} = event.target;
    const {navigationButtons, currentActiveButton} = this.state;
    this.setState({
        buttonDisabled: +currentActiveButton+1 != navigationButtons.length && !this._everythingAnswered(),
        navigationButtons: navigationButtons.map((button, index) => ({...button, isActive: index == id})),
        currentHeaderBackground: navigationButtons[id].backgroundClass,
        currentActiveButton: id,
        usuallyAchieved: navigationButtons[id].age_range,
        bottomButtonMessage: this._bottomButtonStepHandler(id)
    });
  }

  /**
   * Handles the updates caused by the change of milestone answer (questionnaire component)
   * @param {Object} event 
   */
  _changedMilestoneStatus(event) {
    const {id} = event.target.dataset;
    const {currentActiveButton, navigationButtons} = this.state;
    const {milestones} = navigationButtons[currentActiveButton];
    const previousAnswer = milestones.find(m => m.id==id).answer;
    this.setState({
      navigationButtons: navigationButtons.map(button => ({...button, milestones: button.milestones.map(milestone => ({...milestone, answer: milestone.id == id ? !!!previousAnswer : milestone.answer}))}))
    }, () => this.setState({buttonDisabled: +currentActiveButton+1 == navigationButtons.length && !this._everythingAnswered()}));
  }

  /**
   * Defines the content that the button should have
   * @param {Number} id 
   * @return {String}
   */
  _bottomButtonStepHandler(id) {
    const totalSteps = this.state.navigationButtons.length;
    return +id+1 == totalSteps ? 'Finish assessment' : 'Next';
  }

  /**
   * Validates if every answer, in every step, has been answered already
   * @return {Boolean}
   */
  _everythingAnswered() {
    const {navigationButtons} = this.state;
    return navigationButtons.every(button => button.milestones.every(milestone => milestone.answer != null));
  }

  /**
   * Handles the navigation based on the button at the bottom
   */
  _handleBottomButton() {
    const {currentActiveButton, navigationButtons} = this.state;
    const id = +currentActiveButton+1;;
    if(!+currentActiveButton+1 == +navigationButtons.length) {
      this.setState({
        buttonDisabled: !this._everythingAnswered(),
        currentActiveButton: +currentActiveButton + 1,
        navigationButtons: navigationButtons.map((button, index) => ({...button, isActive: index == id})),
        currentHeaderBackground: navigationButtons[id].backgroundClass,
        usuallyAchieved: navigationButtons[id].age_range,
        bottomButtonMessage: this._bottomButtonStepHandler(id)
      }, () => this._scrollTop(250));
    } else {
      this.setState({
        buttonDisabled: false
      })
    }
  }

  /**
   * Scrolls to the top of the window
   * @param {Number} scrollDuration 
   */
  _scrollTop(scrollDuration) {
    const scrollStep = -window.scrollY / (scrollDuration / 15),
          scrollInterval = setInterval(function(){
              if ( window.scrollY != 0 ) {
                  window.scrollBy( 0, scrollStep );
              } else {
                clearInterval(scrollInterval); 
              }
          },15);
  }

   render() {
     const {
        usuallyAchieved,
        currentActiveButton,
        currentHeaderBackground,
        navigationButtons,
        bottomButtonMessage,
        buttonDisabled
      } = this.state;
     return(
       <section>
         <div className={`${styles.LoaderContainer} ${this.state.isLoading ? styles.isLoading : ``}`}>
            <div className={styles.Loader}></div>
         </div>
         <MilestonesDescriptionHeader
            navigationButtons={navigationButtons}
            changedArea={this._changedArea.bind(this)}
            headerTitle={navigationButtons[currentActiveButton].title}
            headerDescription={navigationButtons[currentActiveButton].description}
            currentAreaBackground={currentHeaderBackground}
         />
         <MilestonesSkillsOrganism
            milestones={navigationButtons[currentActiveButton].milestones}
            achievedRange={usuallyAchieved}
            changedMilestoneStatus={this._changedMilestoneStatus.bind(this)}
         />
         <div className={styles.BottomBarContainer}>
            <button disabled={buttonDisabled} onClick={this._handleBottomButton.bind(this)} className={styles.BottomButton}>{bottomButtonMessage}</button>
         </div>
       </section>
     )
   }
}

ReactDOM.render(<Root />, document.getElementById('app'));