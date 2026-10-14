import { useEffect, useState } from "react";

// Devolve o valor "atrasado": só muda depois que o valor
// original ficar parado por "delay" milissegundos.
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    // Cleanup: se o valor mudar antes do tempo, cancela o timer anterior
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;