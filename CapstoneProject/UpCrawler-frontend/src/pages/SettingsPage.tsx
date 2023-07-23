import * as React from 'react';
import { Box, Button, Card, CardContent, CardHeader, FormControl, FormControlLabel, FormLabel, Grid, Input, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';


export default function SettingsPage() {
    const [notification, setNotification] = React.useState<string>('inApp')

    const handleSubmit = () => {
        console.log(notification)
    }

    return (
        <Grid item xs={12} md={6} lg={4}>
      <Card>
      <CardHeader title="Notification Preferences Card" subheader="Please pick your preference" />

      <CardContent>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(1, 1fr)',
          }}
        >
         <FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Notification Preferences</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue={notification}
    name="radio-buttons-group"
    onChange={(event) => setNotification(event.target.value)}
  >
    <FormControlLabel value="inApp" control={<Radio />} label="In App Notifications" />
    <FormControlLabel value="email" control={<Radio />} label="E-mail notifications" />
    <FormControlLabel value="none" control={<Radio />} label="None" />
  </RadioGroup>
</FormControl>

        <Button type="submit" variant="contained" onClick={handleSubmit} sx={{ marginTop: '16px' }}>
          Submit
        </Button>
        </Box>
      </CardContent>
    </Card>
    </Grid>
    )
}