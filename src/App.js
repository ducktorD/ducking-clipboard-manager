import React, { useState, useEffect, useRef } from 'react';
import Element from './Components/Element';

const electron = window.require('electron');
const remote = electron.remote;
const { clipboard } = remote;

const App = () => {
	const [history, setHistory] = useState([]);
	const [newText, setNewText] = useState('');

	// if there is new clipboard then newText changing
	const checkClipboard = () => {
		setNewText(clipboard.readText());
	}

	// checking clipboard in every half seconds
	useEffect(() => {
		setNewText(clipboard.readText);
		const interval = setInterval(() => {
			checkClipboard();
		}, 500);

		return () => {
			clearInterval(interval);
		}
	}, []);

	// if the newText changes then we add it to the history array
	useEffect(() => {
		// console.log(newText);
		if (newText) {
			setHistory([...history, {
				content: newText,
				time: new Date()
			}]);
		}
	}, [newText]);

	// just logging
	useEffect(() => {
		console.log(history);
	}, [history]);

	// the copied one goes to the top
	const copyContentOnClick = (id, content) => {
		if (id !== history.length - 1) {
			removeACopy(id);
		} else {
			// it the user select the newest history
			// to copy then it's only updating the time
			setHistory(hist => hist.map((element, i) => {
				if (i === id) {
					console.log(i, id);
					element.time = new Date();
				}
				return element;
			}));
		}
		clipboard.writeText(content);
	}

	const removeACopy = (id) => {
		setHistory(history.filter((element, i) => i !== id));
		console.log(id);
	}

	const removeAllHistory = () => {
		setHistory([]);
	}

	return (
		<>
			<header>🐣 Ducking Clipboard Manager 🦆</header>
			<section className='App'>
				{
					history.length !== 0
					? history.map((element, id) => <Element key={id} id={id} content={element.content} time={element.time} copyOnClick={copyContentOnClick} onRemove={removeACopy} />).reverse()
					: <h1>You have nothing on clipboard.</h1>
				}
			</section>
			<footer>
				<button className='remove-all-button' onClick={removeAllHistory}>Remove all</button>
			</footer>
		</>
	);
}

export default App;