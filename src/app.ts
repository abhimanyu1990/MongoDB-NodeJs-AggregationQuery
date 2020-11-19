
import express from 'express';
import DatabaseConnection from './database.connection';

import ProductView, { IProductView } from './product-view.model';

const app = express();
app.use(express.json());
new DatabaseConnection();

function generateRandomDate() {
    let start: Date = new Date(2012, 1, 1);
    let end: Date = new Date(2020, 8, 30);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


async function createViews() {
    let view: IProductView | null = await ProductView.findOne({})
    if (view == null) {
        for (let i = 0; i < 2000001; i++) {
            let userId: number = Math.floor(Math.random() * 10000);
            let productId: string = "SKU-" + Math.floor(Math.random() * 1000)
            let date: Date = generateRandomDate();
            let view = {
                "userId": userId,
                "productId": productId,
                "viewDate": date
            }
            let viewDetail: IProductView = await ProductView.create(view);
            if (viewDetail != null) {
                console.log(viewDetail);
            }

        }
    }
}

async function yearlyViewCount(res: any, productId: String, periodStart: Date, periodEnd: Date) {

    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "year": { $substr: ["$viewDate", 0, 4] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                count: 1
            }
        }
    ], function (err: any, result: any) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });

}

async function yearlyDistintViewCount(res: any, productId: String, periodStart: Date, periodEnd: Date) {

    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "userId": "$userId",
                    "year": { $substr: ["$viewDate", 0, 4] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: {
                    "year": "$_id.year"
                },
                count: { $sum: 1 }
            }
        },

        {
            $project: {
                _id: 0,
                year: "$_id.year",
                count: 1
            }
        }
    ], function (err: any, result: any) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });
}


async function monthlyDistinctViewCount(res:any,productId:string, periodStart:Date, periodEnd:Date) {

    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "userId": "$userId",
                    "month": { $substr: ["$viewDate", 5, 2] },
                    "year": { $substr: ["$viewDate", 0, 4] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: {
                    "month":"$_id.month",
                    "year": "$_id.year"
                },
                count: { $sum: 1 }
            }
        },

        {
            $project: {
                _id: 0,
                month:"$_id.month",
                year: "$_id.year",
                count: 1
            }
        }
    ], function (err: any, result: any) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });
}

async function monthlyViewCount(res:any,productId:string, periodStart:Date, periodEnd:Date) {
    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "month": { $substr: ["$viewDate", 5, 2] },
                    "year": { $substr: ["$viewDate", 0, 4] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                year: "$_id.year",
                count: 1
            }
        }], function (err: any, result: any) {
            if (err) {
                console.error(err);
                res.send(err);
            } else {
                res.json(result);
            }
        });
}



async function customDateView(res:any,productId:string,startDate:Date,endDate:Date){
    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    "date": { $substr: ["$viewDate", 0, 10]}
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id.date",
                count: 1
            }
        }
    ], function (err: any, result: any) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });

}

async function customDateDistinctView(res:any,productId:string,startDate:Date,endDate:Date){
    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: {
                    "userId":"$userId",
                    "date": { $substr: ["$viewDate", 0, 10]}
                }
            }
        },
        {
            $group: {
                _id: {
                    
                    "date": "$_id.date"
                },
                count: { $sum: 1 }
            }
            
        },
        {
            $project: {
                _id: 0,
                date: "$_id.date",
                count: 1
            }
        }
    ], function (err: any, result: any) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });

}


async function customWeeklyDateView(res:any,productId:string, periodStart:Date, periodEnd:Date) {
    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "week": { "$week":"$viewDate"},
                    "month": { $substr: ["$viewDate", 5, 2] },
                    "year": { $substr: ["$viewDate", 0, 4] }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                week:"$_id.week",
                month: "$_id.month",
                year: "$_id.year",
                count: 1
            }
        }], function (err: any, result: any) {
            if (err) {
                console.error(err);
                res.send(err);
            } else {
                res.json(result);
            }
        });
}


async function customWeeklyDistinctDateView(res:any,productId:string, periodStart:Date, periodEnd:Date) {
    ProductView.aggregate([

        {
            $match: {
                "productId": productId,
                "viewDate": { $gte: periodStart, $lte: periodEnd }
            }
        },
        {
            $group: {
                _id: {
                    "userId":"$userId",
                    "week": { "$week":"$viewDate"},
                    "month": { $substr: ["$viewDate", 5, 2] },
                    "year": { $substr: ["$viewDate", 0, 4] }
                }
            }
        },
        {
            $group: {
                _id: {
                    "week":"$_id.week",
                    "month":"$_id.month",
                    "year": "$_id.year"
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                week:"$_id.week",
                month: "$_id.month",
                year: "$_id.year",
                count: 1
            }
        }], function (err: any, result: any) {
            if (err) {
                console.error(err);
                res.send(err);
            } else {
                res.json(result);
            }
        });
}


app.get("/product/:id/custom", function (req, res) {
    let productId = req.params.id;
    console.log(req.body.startDate);
    console.log(req.body.endDate);
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    if(req.body.distinct){
        customDateDistinctView(res,productId,startDate,endDate);
    }else{
        customDateView(res,productId,startDate,endDate);
    }
    

});


app.get("/product/:id/weekly", function (req, res) {
    let productId = req.params.id
    console.log(req.body.startDate);
    console.log(req.body.endDate);
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
   
    if(req.body.distinct){
        customWeeklyDistinctDateView(res,productId,startDate,endDate);
    }else{
        customWeeklyDateView(res,productId,startDate,endDate);  
    }
});

app.get("/product/:id/monthly", function (req, res) {
    let productId = req.params.id
    let requestBody = req.body;
    let startYear: number = requestBody.startYear;
    let endYear: number = requestBody.endYear;
    let startMonth: number = requestBody.startMonth;
    let endMonth: number = requestBody.endMonth;
    let periodStart: Date = new Date(startYear, startMonth, 1, 0, 0, 0, 0);
    let periodEnd: Date = new Date(endYear, endMonth, 31, 24, 0, 0, 0)
    
    if(req.body.distinct){
        monthlyDistinctViewCount(res,productId, periodStart, periodEnd)

    }else{
        monthlyViewCount(res,productId, periodStart, periodEnd);
    }
   
});

app.get("/product/:id/yearly", function (req, res) {
    let productId = req.params.id
    let requestBody = req.body;
    let startYear: number = requestBody.startYear;
    let endYear: number = requestBody.endYear;
    let periodStart: Date = new Date(startYear, 0, 1, 0, 0, 0, 0);
    let periodEnd: Date = new Date(endYear, 11, 31, 24, 0, 0, 0)
    console.log(periodStart);
    console.log(periodEnd);
    if (req.body.distinct) {
        yearlyDistintViewCount(res, productId, periodStart, periodEnd);
    } else {
        yearlyViewCount(res, productId, periodStart, periodEnd)
    }
});

createViews();
app.listen(3000, () => {
    console.log("Application is running on port 3000")
})