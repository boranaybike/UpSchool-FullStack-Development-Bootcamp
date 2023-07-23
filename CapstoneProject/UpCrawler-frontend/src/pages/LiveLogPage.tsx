import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { GetLog } from '../types/LogTypes';
import { GetProduct } from '../types/ProductTypes';

const BASE_SIGNALR_URL = import.meta.env.VITE_API_SIGNALR_URL;

export default function LiveLogPage() {
  const [logs, setLogs] = useState<GetLog[]>([]);
  const [products, setProducts] = useState<GetProduct[]>([]);
  const [connection, setConnection] = useState<HubConnection | undefined>(undefined);

  useEffect(() => {
    const startConnection = async () => {
      const jwtJson = localStorage.getItem('upcrawler_user');
      if (jwtJson) {
        const newConnection = new HubConnectionBuilder()
          .withUrl(`${BASE_SIGNALR_URL}Hubs/SeleniumLogHub`)
          .withAutomaticReconnect()
          .build();

          newConnection.on("NewSeleniumLogAdded", (log) => {
            setLogs(prevLogs => [...prevLogs, log]);
            console.log(log);
          });
          
        newConnection.on("NewProductAdded", (product) => {
          setProducts(prevProducts => [...prevProducts, product]);
          console.log(products);
        });

        await newConnection.start();
        setConnection(newConnection);
      }
    };

    startConnection();

    return () => {
      connection?.off("NewSeleniumLogAdded");
      connection?.stop();
    };
  }, []);

  return (
    <div>
      <h1>LogsPage</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.message}</li>
        ))}
      </ul>
      <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}