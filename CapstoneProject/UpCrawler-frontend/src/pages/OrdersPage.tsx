import { useEffect, useState } from 'react';
import api from "../services/axiosService";
import { OrderGetAll } from '../types/OrderTypes';
import { Button, Card, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import Iconify from "../components/iconify"
import moment from 'moment';
import { GetLog } from '../types/LogTypes';
import { OrderDelete } from '../types/OrderTypes';


const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'userid', label: 'User Id', alignRight: false },
  { id: 'requestedAmount', label: 'Requested Amount', alignRight: false },
  { id: 'crawleType', label: 'Crawle Type', alignRight: false },
  { id: 'createdOn', label: 'Created On', alignRight: false },
  { id: '' },
  { id: '' },
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    // @ts-ignore
    return array.filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function OrdersPage() {
  const [openModal, setOpenModal] = useState(false);

  const [orders, setOrders] = useState<OrderGetAll[]>([]);

  const [logs, setLogs] = useState<GetLog[]>([]);
  
  const [originalLogs, setOriginalLogs] = useState<GetLog[]>([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.post("/Orders/GetAll", {});

        if (response.data) {
          setOrders(response.data);
        } else {
          console.log(response.statusText);
        }
      } catch (error) {
        console.log("Something went wrong!");
      }
    }

    async function fetchLogs(){
      try {
        const response = await api.post("/SeleniumLog/GetAll", {});

        if (response.data) {
          setLogs(response.data);          
          setOriginalLogs(response.data);
        } else {
          console.log(response.statusText);
        }
      } catch (error) {
        console.log("Something went wrong!");
      }
    }
    fetchOrders();
    fetchLogs();
  }, []);

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenMenu = (event, orderId) => {
    setOpenModal(true);
    const filteredLogs = originalLogs.filter((log) => log.orderId == orderId);

    // @ts-ignore
    const sortedLogs = filteredLogs.sort((a, b) => new Date(a.sentOn) - new Date(b.sentOn));
    setLogs(sortedLogs);
  };

    const [orderDelete, setOrderDelete] = useState<OrderDelete>();

  const handleDeleteOrder = async (event, orderId) => {
    try {
      setOrderDelete({id: orderId});
      const response = await api.post("/Orders/Delete", orderDelete);
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      } catch (error) {
        console.log(error);
      }
  };

  
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredUsers = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;


  return (
    <div>
      <h5>Order Page</h5>
      <Container>

      <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map(headCell => (
                    <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                  >
                    {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, userId, requestedAmount, crawleType, createdOn } = row;
                    // @ts-ignore
                    const selectedUser = selected.indexOf(id) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                        <TableCell align="left">{id}</TableCell>

                        <TableCell align="left">{userId}</TableCell>

                        <TableCell align="left">{requestedAmount}</TableCell>

                        <TableCell align="left">{crawleType == 0 ? 'All' : crawleType == 1 ? 'OnDiscount' : 'NonDiscount'}</TableCell>

                        <TableCell align="left">{moment(createdOn).format('L')} {moment(createdOn).format('LT')}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => handleOpenMenu(event, id)}
                          >
                            <Iconify icon={'teenyicons:eye-outline'} />
                          </IconButton>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event) => handleDeleteOrder(event, id)}>
                            <Iconify icon={'eva:trash-2-outline'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        </Container>
           
        <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
      >
        <DialogTitle>
         Logs for this order
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
{ 
          <ul>
        {logs.map((log, index) => (
          <li key={index}>
            { moment(log.sentOn).format('YYYY-MM-DD HH:mm')} - {log.message}
            </li>
        ))}
      </ul> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Close
          </Button>
      
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OrdersPage;
