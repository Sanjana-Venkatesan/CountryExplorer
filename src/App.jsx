import React, { useState, useEffect, useContext, createContext } from "react";
import noteService from './services/country';
import ThemeSwitcher from './themeSwitcher';
import CountryQuiz from './countryQuiz'; // Import the CountryQuiz Component

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
const Showlist = ({ countries, countryList, setSelectedCountry }) => {
  const { theme } = useContext(ThemeContext);

  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 4;

  const totalPages = Math.ceil(countries.length / countriesPerPage);
  const countriesToShow = countries.slice(
    (currentPage - 1) * countriesPerPage,
    currentPage * countriesPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div style={{ ...styles.showlistContainer, backgroundColor: theme === 'light' ? '#f0f8ff' : '#1a1a1a' }}>
      {countries.length === 0 ? (
        <p style={styles.loadingText}>Loading countries...</p>
      ) : (
        <ul style={styles.list}>
          {countriesToShow.map(country => (
            <li key={country.cca3} style={styles.listItem}>
              <p style={styles.countryText}>
                {country.name.common}{' '}
                <button
                  onClick={() => setSelectedCountry(country)}
                  style={styles.button}
                >
                  Show details
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}

      <div style={styles.paginationContainer}>
        <button onClick={goToPreviousPage} disabled={currentPage === 1} style={styles.paginationButton}>
          Previous
        </button>
        <span style={styles.paginationText}> Page {currentPage} of {totalPages} </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages} style={styles.paginationButton}>
          Next
        </button>
      </div>
    </div>
  );
};

const Display = ({ country, countryList, setSelectedCountry }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      ...styles.modalContent,
      backgroundColor: theme === 'light' ? '#ffffff' : '#333333',
      color: theme === 'light' ? '#333333' : '#ffffff'
    }}>
      <h2>{country.name.common}</h2>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} style={styles.flagImage} />
      <p style={styles.infoText}><strong>Region:</strong> {country.region}</p>
      <p style={styles.infoText}><strong>Sub-region:</strong> {country.subregion}</p>
      <p style={styles.infoText}><strong>Capital:</strong> {country.capital}</p>
      <h4>Languages Spoken:</h4>
      <ul style={styles.languageList}>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key} style={styles.languageItem}>{value}</li>
        ))}
      </ul>
      <p style={styles.infoText}><strong>Area:</strong> {country.area} km²</p>
      <p style={styles.infoText}><strong>Population:</strong> {country.population}</p>
      {country.borders && country.borders.length > 0 ? (
        <div>
          <h4>Borders with:</h4>
          <ul style={styles.borderList}>
            {country.borders.map(border => (
              <li key={border} style={styles.borderItem}>{countryList[border]}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={styles.infoText}>This country has no borders.</p>
      )}
      <button onClick={() => setSelectedCountry(null)} style={styles.closeButton}>Close</button>
    </div>
  );
};

const Countries = ({ countriesToShow, searchQuery, countryList, setSelectedCountry }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{
      ...styles.container,
      backgroundColor: theme === 'light' ? '#f0f8ff' : '#1a1a1a',
      color: theme === 'light' ? '#333333' : '#ffffff'
    }}>
      {searchQuery.length === 0 ? (
        <p style={styles.infoText}>Search for a country to view its details</p>
      ) : countriesToShow.length >= 10 ? (
        <p style={styles.infoText}>Too many countries match. Try giving a few more letters.</p>
      ) : (
        <ul style={styles.list}>
          {countriesToShow.map(country => (
            <li key={country.cca3} style={styles.listItem}>
              {country.name.common}
              <button onClick={() => setSelectedCountry(country)} style={styles.button}>
                Display
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function AppContent() {
  const { theme } = useContext(ThemeContext);
  const [countries, setCountries] = useState([]);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    noteService.getAll()
      .then(initialCountries => {
        setCountries(initialCountries);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const countryNames = (countries) => {
    return countries.reduce((acc, country) => {
      acc[country.cca3] = country.name.common;
      return acc;
    }, {});
  };

  const countryList = countryNames(countries);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCountry(null); // Clear selected country when searching
  };

  const handleToggleList = () => {
    if (selectedCountry) {
      setSelectedCountry(null); // Back to country list view
    } else {
      setShowList(prevShowList => !prevShowList); // Toggle list display
    }
  };

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      ...styles.appContainer,
      backgroundColor: theme === 'light' ? '#f0f8ff' : '#1a1a1a',
      color: theme === 'light' ? '#333333' : '#ffffff'
    }}>
      <ThemeSwitcher />
      <h1 style={{
        ...styles.header,
        color: theme === 'light' ? '#0044cc' : '#66b3ff'
      }}>Country Explorer</h1>
      <div style={styles.searchContainer}>
        <p>Search: <input value={searchQuery} onChange={handleSearch} style={styles.searchInput} /></p>
        <button onClick={() => setIsModalOpen(true)} style={styles.quizButton}>Start Flag Quiz</button>
        <button onClick={handleToggleList} style={styles.toggleButton}>
          {selectedCountry ? "Back to all countries" : showList ? "Hide countries" : "See all countries"}
        </button>
      </div>

      {!selectedCountry && (
        <Countries
          countriesToShow={countriesToShow}
          searchQuery={searchQuery}
          countryList={countryList}
          setSelectedCountry={setSelectedCountry}
        />
      )}

      {showList && !selectedCountry && (
        <Showlist
          countries={countries}
          countryList={countryList}
          setSelectedCountry={setSelectedCountry}
        />
      )}

      {selectedCountry && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <Display
              country={selectedCountry}
              countryList={countryList}
              setSelectedCountry={setSelectedCountry}
            />
          </div>
        </div>
      )}
      
      {isModalOpen && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="modal-content" style={styles.modalContent}>
            <CountryQuiz countries={countries} />
            <button onClick={() => setIsModalOpen(false)} style={styles.closeButton}>Close Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  themeButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  // Update existing styles with theme-specific values
  appContainer: {
    fontFamily: '"Roboto", sans-serif',
    padding: '20px',
    minHeight: '100vh',
    transition: 'all 0.3s ease',
  
  },
  header: {
    textAlign: 'center',
    fontSize: '36px',
    color: '#0044cc',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '5px',
    width: '200px',
    border: '1px solid #ccc',
  },
  quizButton: {
    padding: '10px 20px',
    backgroundColor: '#8a2be2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#32cd32',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  listItem: {
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  countryText: {
    fontSize: '18px',
    color: '#333',
  },
  button: {
    backgroundColor: '#ff6347',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  paginationText: {
    fontSize: '18px',
    color: '#333',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '60%',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  flagImage: {
    width: '150px',
    height: '100px',
    objectFit: 'cover',
  },
  infoText: {
    fontSize: '16px',
    color: '#555',
  },
  languageList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  languageItem: {
    fontSize: '16px',
    color: '#333',
  },
  borderList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  borderItem: {
    fontSize: '16px',
    color: '#333',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#ff6347',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
