import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Get the initial value from localStorage if it exists
  const [state, setState] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // Update localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorage;
