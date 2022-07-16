const mongoose=require("mongoose");
require("../models/order");
const orders = mongoose.model("orders")


module.exports.getOrders=(req,res,next)=>{
    orders.find().populate({path:"userId"})
    .populate({path:"orderItems",populate:{path:"productId",model:"product"}})
    .populate({path:"orderItems",populate:{path:"businessId",model:"user"}})

    //{name:1,email:1}        
    .then(data=>{
              console.log();
                res.status(200).json(data);
                
            })
            .catch(error=>next(error))
}

module.exports.getOrderById=async(req,res,next)=>{

    const order = await orders.findById(req.params.id).populate({path:"userId",select:{"email":1,_id:0}})
    
      if (order) {
        res.json(order)
      } else {
        res.status(404)
        throw new Error('Order not found')
      }
    // orders.find({_id:req.params.id}).then(data=>{
    //     if(data==null) next(new Error(" orders not found"))
    //     res.status(200).json(data);
    // }).catch(err=>next(err))
}

module.exports.addOrders=(req,res,next)=>{
    const order = new orders({
        userId : req.body.userId,
        orderItems : req.body.orderItems,
        paymentMethod:req.body.paymentMethod,
        paymentResult : req.body.paymentResult,
        shippingPrice: req.body.shippingPrice,
        totalPrice:req.body.totalPrice,
    })
    order.save() .then(data=>{
        res.status(201).json({data:"added"});
      })
      .catch(error=>next(error))
}
module.exports.updateOrderToPaid=async(req,res)=>{
    const order = await orders.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
  
      const updatedOrder = await order.save()
  
      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
}
module.exports.updateOrderToDelivered=async(req,res)=>{
    const order = await orders.findById(req.params.id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
  
      const updatedOrder = await order.save()
  
      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
}
module.exports.getMyOrder=(req,res,next)=>{
  
  
   orders.findOne({userId:req.id},{orderItems:1}).then(data=>{
    console.log(req.id)
    res.status(200).json(data)
   })
   .catch(err=>{next(err)
   console.log(err)}
   )
 
}
