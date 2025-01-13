import React from 'react'
import './i18n'

function App() {
  useTitle('Page Title')
  const [count, setCount] = useState(0)
  const { t } = useTranslation()

  return (
    <div className="App">
      <Button />
      <BaseButton />
      <BaseInput />
      <pre>{`${!isMobile()}`}</pre>
      <IconLogosReact style={{ fontSize: '3em' }} />
      <header className="App-header">
        <h1>{t('welcome')}</h1>
        <p>
          <button type="button" onClick={() => setCount(count => count + 1)}>
            count is:
            {' '}
            {count}
          </button>
        </p>
      </header>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/list" element={<PageA />} />
          <Route path="/detail/:id" element={<PageB />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
