import * as React from 'react';
import classnames from 'classnames';
import { Country, CountryData } from './types';

type CountrySelectorProps = {
  removeFavoriteCountry: (country: Country) => void;
  country: Country;
  allCountries: CountryData[];
  favoriteCountries: Country[];
};
const CountrySelector = ({
  removeFavoriteCountry,
  country,
  allCountries,
  favoriteCountries
}: CountrySelectorProps) => {
  const [dropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeDropdown();
        e.stopPropagation();
      }
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, []);

  const getFormatted = (country: string) =>
    allCountries.find((s) => s.country.toLowerCase() === country)?.country;

  const onRemoveFavoriteCountry = (e: React.MouseEvent, favoriteCountry: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteCountry(favoriteCountry);
  };

  const closeDropdown = () => {
    setInputValue('');
    setDropdownOpen(false);
  };

  return (
    <nav className="NavBar top-bar" role="navigation" aria-label="main navigation">
      <div className={classnames('dropdown', { 'is-active': dropdownOpen })} ref={dropdownRef}>
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
            }}
          >
            <span>{getFormatted(country)}</span>
            <span className="icon is-small">
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <div className="field dropdown-item">
              <div className="control has-icons-left">
                <input
                  type="text"
                  placeholder="Search"
                  className="input is-transparent"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.currentTarget.value)}
                  ref={inputRef}
                />
                <span className="icon is-left">
                  <i className="fa fa-search"></i>
                </span>
              </div>
            </div>
            {favoriteCountries
              .filter((entry) => entry.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
              .map((_favoriteCountry, i) => {
                const favoriteCountry = _favoriteCountry.toLowerCase();
                return (
                  <a
                    className={classnames('dropdown-item', {
                      'is-active': favoriteCountry.toLowerCase() === country
                    })}
                    onClick={closeDropdown}
                    href={`/#/${favoriteCountry}`}
                    key={`${favoriteCountry}-${i}`}
                  >
                    <span>{getFormatted(favoriteCountry)}</span>
                    <span
                      className="icon is-small remove-favorite"
                      onClick={(e) => onRemoveFavoriteCountry(e, favoriteCountry)}
                    >
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </span>
                  </a>
                );
              })}
            <hr className="dropdown-divider" />
            {allCountries
              .map((entry) => [entry.country.toLowerCase(), entry.country])
              .filter(([entry]) => favoriteCountries.indexOf(entry) === -1)
              .filter(([entry]) => entry.indexOf(inputValue.toLowerCase()) > -1)
              .map(([entry, entryFormatted], i) => {
                return (
                  <a
                    className={classnames('dropdown-item', {
                      'is-active': entry === country
                    })}
                    onClick={closeDropdown}
                    href={`/#/${entry}`}
                    key={`${entry}-${i}`}
                  >
                    {entryFormatted}
                  </a>
                );
              })}
          </div>
        </div>
      </div>
      <a href="https://corona-charts.xyz">
        <h6 className="title is-6">
          <i className="fa fa-virus" aria-hidden="true"></i> Corona charts
        </h6>
      </a>
    </nav>
  );
};

export default CountrySelector;
