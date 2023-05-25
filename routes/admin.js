const express = require('express');
const router = express.Router();
const Shipment = require('../models/shipment')
const jwt = require('jsonwebtoken');

function adminVerify(token) {
    let isAdmin = false;
    jwt.verify(token,process.env.secret, (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err);
        isAdmin = false;
      } 
        console.log("Type of user",decoded.isAdmin)
      if(decoded.isAdmin=="ADMIN"){
        isAdmin = true;
        console.log("ISADMIN TRue")
      }
  })
  return isAdmin;
  }

router.post('/statusupdate',async (req, res) => {
    let token = req.headers['authorization'].split("Bearer ")[1];
    console.log("tokennn",token)
    let isAdmin = adminVerify(token)
    if(!isAdmin){
        res.send("User has no ADMIN privileages")
        return
    }
    let shipmentId = req.body.shipmentId;
    let status = req.body.status;
    const update = { status:status};
    Shipment.findByIdAndUpdate(shipmentId, update, { new: true })
    .then(updatedDoc => {
    if (!updatedDoc) {
        console.log('Document not found');
    } else {
        console.log('Updated document:', updatedDoc);
        res.json(updatedDoc)
    }
    })
    .catch(err => {
    console.error('Error updating document:', err);
    });

})


module.exports =router;