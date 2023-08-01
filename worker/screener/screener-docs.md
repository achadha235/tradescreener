# Screener Documentation

Using the Intrinio Security Screener API entails constructing clause conditions and optional logic to arrive at your desired list of securities. The Security Screener API accepts a POST Request Body in JSON format containing the logical conditions you wish to screen with.

## Security Screener API Endpoint

`https://api-v2.intrinio.com/securities/screen`

## POST Request Body JSON Example


`{   "operator": "AND",   "clauses": [     {       "field": "marketcap",       "operator": "gt",       "value": "500000000"     }   ] }`

## Operator

The "operator" property specifies the logic to apply between your clause conditions. Valid operator values are as follows:

- `AND`
- `OR`
- `NOT`

## Clauses Array

The "clauses" property is an array of conditions which the security must meet. Each clause condition must contain the following properties:

|Property|Description|Example|
|---|---|---|
|field|The data tag field to which the condition applies. |"marketcap"|
|operator|The logical operator for the condition. Valid values are: Equal to: `eq`, Greater than: `gt`, Greater than or equal to: `gte`, Less than: `lt`, Less than or equal to: `lte`, Contains text: `contains`|"gt"|
|value|The value applied to screen the field by based on the operator|"500000000"|

## Complete Examples

Below are several complete examples demonstrating the usage of operators and clauses.

### Example 1: Securities with low PE and high ROI

**Goal:** Return securities with a PE ratio <= 5 and a return-on-equity >= to 20%.

`{   "operator": "AND",   "clauses": [     {       "field": "pe_ratio",       "operator": "lte",       "value": "5"     },     {       "field": "return_on_equity",       "operator": "gte",       "value": "0.2"     }   ] }`

### Example 2: Securities with more than $10b cash or $100b market cap

**Goal:** Return securities with cash >= 10,000,000,000 or market cap >= 100,000,000,000

`{   "operator": "OR",   "clauses": [     {       "field": "cash",       "operator": "gte",       "value": "10000000000"     },     {       "field": "marketcap",       "operator": "gte",       "value": "100000000000"     }   ] }`

