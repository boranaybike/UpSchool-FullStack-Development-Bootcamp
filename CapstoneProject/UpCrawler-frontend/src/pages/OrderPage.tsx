import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import { Box } from '@mui/system';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { OrderAddCommand } from '../types/OrderTypes';
import { GetProduct } from '../types/ProductTypes';
import { GetLog } from '../types/LogTypes';
import { LogCountContext } from '../context/StateContext';
import api from "../services/axiosService";
import ExcelJS from 'exceljs';


const BASE_SIGNALR_URL = import.meta.env.VITE_API_SIGNALR_URL;

export default function OrderPage() {
  const {setLogCount} = useContext(LogCountContext);
  const [orderHubConnection, setOrderHubConnection] = useState<HubConnection | undefined>(undefined);
  const [crawlerType, setCrawlerType] = useState<string>("");
  const [openLog, setOpenLog] = useState<boolean>(false);
  const [logs, setLogs] = useState<GetLog[]>([]);
  const [products, setProducts] = useState<GetProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<GetProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  
  useEffect(() => {
    const startConnection = async () => {
      const jwtJson = localStorage.getItem('upcrawler_user');
      if (jwtJson) {
        const connection = new HubConnectionBuilder()
          .withUrl(`${BASE_SIGNALR_URL}Hubs/SeleniumLogHub`)
          .withAutomaticReconnect()
          .build();

        await connection.start();
        setOrderHubConnection(connection);
        let count = 0;
        connection.on("NewSeleniumLogAdded", (log) => {
          setLogs(prevLogs => [...prevLogs, log]);
          count += 1;
          setLogCount(count)
        });
        
        connection.on("NewProductAdded", (product) => {
        setProducts(prevProducts => [...prevProducts, product]);
        });
      }
      
    async function fetchProducts() {
      try {
        const response = await api.post('/Products/GetAll', {});
        if (response.data) {
            setProducts(response.data);
            setOriginalProducts(response.data);
        } else {
          console.log(response.statusText);
        }
      } catch (error) {
        console.log("Something went wrong!");
      }
    }

    fetchProducts() ;
    };

    if (!orderHubConnection) {
      startConnection();
    }
  }, []);

  const [order, setOrder] = useState<OrderAddCommand>();

  const handleSubmit = async () => {
    try {
      const response = await orderHubConnection?.invoke('AddANewOrder', order);
      setOrderId(response);
      setOpenLog(true);

    } catch (error) {
      console.error(error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
        // @ts-ignore
    setOrder({
      ...order,
      [name]: name === "RequestedAmount" ? +value : value,
      ProductCrawlType: crawlerType,
    });
  };  
  
  const handleExportClick = async () => {
    try {
      setIsLoading(true);
      const workbook = new ExcelJS.Workbook();
      const filteredProducts = originalProducts.filter((product) => product.orderId == orderId);
      setProducts(filteredProducts);


      const worksheet = workbook.addWorksheet('Filtered Products');
      worksheet.addRow(['ID', 'Name', 'Image', 'is OnSale', 'Price', 'Sale Price']);

      products.forEach((product) => {
        worksheet.addRow([product.id, product.name, product.picture, product.isOnSale, product.price, product.salePrice]);
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'crawled_products.xlsx';
      a.click();
      URL.revokeObjectURL(url);

      setIsLoading(false);
    } catch (error) {
      console.error('Error exporting filtered products:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
    <Grid item xs={12} md={6} lg={4}>
      <Card>
      <CardHeader title="Order Card" subheader="Please enter your order" />

      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Product Crawl Type</InputLabel>
           <Select
            labelId="demo-simple-select-label"
            id="ProductCrawlType"
            value={crawlerType}
            label="Product Crawl Type"
            onChange={(e) => setCrawlerType(e.target.value)}>
            <MenuItem value={"All"}>All</MenuItem>
            <MenuItem value={"Ondiscount"}>Ondiscount</MenuItem>
            <MenuItem value={"Nondiscount"}>Nondiscount</MenuItem>
          </Select>
          </FormControl>
        <TextField type="number" id="RequestedAmount" label="Requested Amount" variant="outlined" name="RequestedAmount" onChange={handleChange} />

        <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ marginTop: '16px' }}>
          Submit
        </Button>
        
    <Button variant="contained" color="primary" onClick={handleExportClick} disabled={isLoading}>
      {isLoading ? 'Exporting...' : 'Export Filtered Products'}
    </Button>
        </Box>
      </CardContent>
    </Card>
    </Grid>
    <Grid item xs={12} md={6} lg={2}></Grid>

    {openLog && (
      <Grid item xs={12} md={6} lg={6}>
      <Card>
      <CardHeader title="Log" subheader="Please enter your order" />

      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
           <h1>LogsPage</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.message}</li>
        ))}
      </ul>
        </Box>
      </CardContent>
    </Card>
    </Grid>
    )}
    </>
  );
  
}