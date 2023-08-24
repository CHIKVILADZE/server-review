const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
