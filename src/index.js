import { createRoot } from 'react-dom'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { Provider } from 'react-redux'
import I18nProvider from './locales/i18n'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/GlobalStyles.scss'

import App from './App'

import reduxStore, { persistor } from './redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Provider store={reduxStore}>
        <I18nProvider>
            <App persistor={persistor} />
        </I18nProvider>
    </Provider>,
)
