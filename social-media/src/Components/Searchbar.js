import React from 'react';
import Autosuggest from 'react-autosuggest';
import { withRouter} from 'react-router-dom';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import '../Css/Searchbar.css';  

class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            Usernames: []
        };    

        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.escapeRegexCharacters = this.escapeRegexCharacters.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
    }

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    componentDidMount() {
        fetch("http://localhost:5000/users/getusernames")
        .then(response => response.json()).then(data => {  
            this.setState({ Usernames: data });
        });
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getSuggestionValue(suggestion){
        this.setState({value: suggestion}, () => {
            this.props.history.push(`/profile/${suggestion}`);
        });
        return suggestion;
    } 
        
    getSuggestions(value) {
        const escapedValue = this.escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }
        
        const regex = new RegExp('\\b' + escapedValue, 'i');
        
        return this.state.Usernames.filter(person => regex.test(person));
    }

    renderSuggestion(suggestion, { query }) {
        const suggestionText = suggestion;
        const matches = AutosuggestHighlightMatch(suggestionText, query);
        const parts = AutosuggestHighlightParse(suggestionText, matches);
        
        return (
            <span className={'suggestion-content ' + suggestion.twitter}>
            <span className="name">
                {
                parts.map((part, index) => {
                    const className = part.highlight ? 'highlight' : null;
        
                    return (
                    <span className={className} key={index} onClick={() => console.log(suggestion)}>{part.text}</span>
                    );
                })
                }
            </span>
            </span>
        );
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Find Friends...",
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest 
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps} />
            );
        }
}

export default withRouter(Searchbar);