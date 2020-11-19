Problem Statement 

ProductView detail is saved in mongodb database having userId, productId and Date as field. Write Node.js program to create weekly, monthly, yearly, daily and custom data report for total and distinct view

Approach #1SKU-517

1. All the data is saved  and  not processed as per requirement. Run the query directly on database. It will be in efficient and will take more time

Approach #2

1. Save the additional data in the ProductView collection document as time of saving the product view having additional field year, month and data as number. It will help in quick preprocessing of data and will be easy to query.
2. At the end of day use jobs to save the data in MIS/Report for daily, monthly, yearly views for each product
3. Run the report queries on the MIS database and for current day report on transactional database.


In thid example, I am following first approach and using MongoDB aggregate queries for different requirement.


Function Detail

CreateViews() -> this function create the records in the database {userId:number,productId ::SKU-XXXX, viewDate:Date}

yearlyViewCount() -> this function create the report for yearly count for a product view

yearlyDistinctViewCount() -> this function create the report for yearly distinct view  for a product view

monthlyViewCount() -> this function create the report for monthly count for a product view

monthlyDistinctViewCount() -> this function create the report for monthly dsitinct count for a product view

customDateView() -> this function create the report for view count between custom date for a product

customDateDistinctView()  -> this function create the report for distinct view count between custom date for a product

customWeeklyDateView() -> this function create the report for weekly view count between custom date for a product

customWeeklyDistinctDateView() -> this function create the report for distinct weekly view count between custom date for a product


APIs

1. Weekly View

Get http://localhost:3000/product/{productId}/weekly

Example Url 
Get http://localhost:3000/product/SKU-517/weekly

Request Body 

{
    "startDate":"2020-11-01",
    "endDate":"2020-11-30",
    "distinct":true   // if you want to distinc count keep it true , elase for total view it will be false
}

Response Body ( distinct : true)

[
    {
        "count": 1,
        "week": 46,
        "month": "11",
        "year": "2020"
    }
]

Response Body ( distinct : false )

[
    {
        "count": 8897,
        "week": 46,
        "month": "11",
        "year": "2020"
    }
]



2. Custom Date

Get http://localhost:3000/product/{productId}/custom

Example Url 
Get http://localhost:3000/product/SKU-517/custom

Request Body 

{
    "startDate":"2020-8-01",
    "endDate":"2020-11-30",
    "distinct":true   // if you want to distinc count keep it true , elase for total view it will be false
}

Response Body ( distinct : false)

[
    {
        "count": 1,
        "date": "2020-09-28"
    },
    {
        "count": 1,
        "date": "2020-08-04"
    },
    {
        "count": 1,
        "date": "2020-09-06"
    },
    {
        "count": 1,
        "date": "2020-08-26"
    },
    {
        "count": 8897,
        "date": "2020-11-19"
    },
   .
   .
   .
]

Response Body ( distinct : true )

[
    {
        "count": 1,
        "date": "2020-08-15"
    },
    {
        "count": 1,
        "date": "2020-08-13"
    },
    {
        "count": 1,
        "date": "2020-09-15"
    },
    {
        "count": 1,
        "date": "2020-11-19"
    },
    .
    .
    .
]

3. Monthly View Report

Get http://localhost:3000/product/{productId}/monthly

Example Url

Get http://localhost:3000/product/SKU-517/monthly

Request Body

{
    "startYear":2020,
    "startMonth":0,  //Month - 0 for January & 11 for December
    "endYear":2020,
    "endMonth":12,  //Month - 0 for January & 11 for December
    "distinct":true
 }

Response (distinct : true)

[
    {
        "count": 37,
        "month": "01",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "07",
        "year": "2020"
    },
    {
        "count": 1,
        "month": "11",
        "year": "2020"
    },
    {
        "count": 30,
        "month": "09",
        "year": "2020"
    },
    {
        "count": 31,
        "month": "06",
        "year": "2020"
    },
    {
        "count": 31,
        "month": "04",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "05",
        "year": "2020"
    },
    {
        "count": 30,
        "month": "03",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "02",
        "year": "2020"
    },
    {
        "count": 32,
        "month": "08",
        "year": "2020"
    }
]


Response (distinct : false)

[
    {
        "count": 8897,
        "month": "11",
        "year": "2020"
    },
    {
        "count": 30,
        "month": "09",
        "year": "2020"
    },
    {
        "count": 37,
        "month": "01",
        "year": "2020"
    },
    {
        "count": 31,
        "month": "06",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "07",
        "year": "2020"
    },
    {
        "count": 31,
        "month": "04",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "02",
        "year": "2020"
    },
    {
        "count": 32,
        "month": "08",
        "year": "2020"
    },
    {
        "count": 29,
        "month": "05",
        "year": "2020"
    },
    {
        "count": 30,
        "month": "03",
        "year": "2020"
    }
]

4. Yearly View Report

Get http://localhost:3000/product/{productId}/yearly

Example Url
http://localhost:3000/product/SKU-517/yearly

Response Body

{
    "startYear":2012,
    "endYear":2020,
    "distinct":false
 }

Response (Distinct false)

[
    {
        "count": 360,
        "year": "2018"
    },
    {
        "count": 9175,
        "year": "2020"
    },
    {
        "count": 380,
        "year": "2016"
    },
    {
        "count": 395,
        "year": "2014"
    },
    {
        "count": 386,
        "year": "2019"
    },
    {
        "count": 389,
        "year": "2017"
    },
    {
        "count": 352,
        "year": "2012"
    },
    {
        "count": 409,
        "year": "2015"
    },
    {
        "count": 360,
        "year": "2013"
    }
]


Response (Distinct true)

[
    {
        "count": 381,
        "year": "2019"
    },
    {
        "count": 358,
        "year": "2018"
    },
    {
        "count": 380,
        "year": "2017"
    },
    {
        "count": 355,
        "year": "2013"
    },
    {
        "count": 277,
        "year": "2020"
    },
    {
        "count": 393,
        "year": "2015"
    },
    {
        "count": 340,
        "year": "2012"
    },
    {
        "count": 389,
        "year": "2014"
    },
    {
        "count": 375,
        "year": "2016"
    }
]