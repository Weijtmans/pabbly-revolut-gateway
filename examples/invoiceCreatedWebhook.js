{
    path: '/.netlify/functions/webhooks',
    httpMethod: 'POST',
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    headers: {
      'accept-encoding': 'gzip',
      'x-forwarded-proto': 'https',
      'x-forwarded-for': '::1',
      'content-type': 'application/json;charset=utf-8',
      authorization: 'Basic Og==',
      accept: 'application/json, text/plain, */*',
      'content-length': '2134',
      'user-agent': 'axios/0.19.2',
      host: '2d1a4e3f7976.ngrok.io',
      connection: 'close',
      'client-ip': '::1'
    },
    multiValueHeaders: {
      'accept-encoding': [ 'gzip' ],
      'x-forwarded-proto': [ 'https' ],
      'x-forwarded-for': [ '::1' ],
      'content-type': [ 'application/json;charset=utf-8' ],
      authorization: [ 'Basic Og==' ],
      accept: [ 'application/json, text/plain, */*' ],
      'content-length': [ '2134' ],
      'user-agent': [ 'axios/0.19.2' ],
      host: [ '2d1a4e3f7976.ngrok.io' ],
      connection: [ 'close' ],
      'client-ip': [ '::1' ]
    },
    body: '{"event_type":"invoice_create","event_source":"checkout","data":{"quantity":1,"product_id":"610948add2ce1a7092b56069","setup_fee":0,"currency_symbol":"€","credit_note":{"total_tax":"0.00","status":"success","new_plan_total":1.5,"total_credit_amount":0,"charge_amount":1.5,"credit_applied":[]},"tax_apply":{"country":"NL","tax_id":"","exempt_tax":[],"total_amount":1.5,"total_tax":"0.00"},"createdAt":"2021-08-05T13:43:01.174Z","updatedAt":"2021-08-05T13:43:01.174Z","id":"610beae55970a1191c7699a8","customer_id":"610beae55970a1191c7699a6","user_id":"6109487c0d0ca4725d421ed8","subscription_id":"610beae55970a1191c7699a7","status":"sent","invoice_id":"INV-5","payment_term":"","amount":1.5,"due_amount":0,"due_date":"2021-08-05T13:43:01.011Z","plan_id":["610b9d885970a1191c7691c4"],"subscription":{"plan":{"plan_active":"true","payment_gateway":"all","failed_payment_gateway_array":[],"failed_payment_gateway":"","gateways_array":[],"createdAt":"2021-08-05T08:12:56.877Z","updatedAt":"2021-08-05T13:39:45.062Z","id":"610b9d885970a1191c7691c4","product_id":"610948add2ce1a7092b56069","user_id":"6109487c0d0ca4725d421ed8","plan_name":"Pro (no trial)","plan_code":"pro-no-trial","price":1.5,"billing_period":"w","billing_period_num":"1","billing_cycle":"lifetime","billing_cycle_num":"","trial_period":0,"setup_fee":0,"plan_description":""},"setup_fee":0,"payment_terms":"","currency_symbol":"€","payment_method":"custom","taxable":true,"gateway_type":"custom","gateway_id":"61094a75d2ce1a7092b5607f","custom_fields":[],"createdAt":"2021-08-05T13:43:01.156Z","updatedAt":"2021-08-05T13:43:01.156Z","id":"610beae55970a1191c7699a7","customer_id":"610beae55970a1191c7699a6","product_id":"610948add2ce1a7092b56069","plan_id":"610b9d885970a1191c7691c4","amount":1.5,"user_id":"6109487c0d0ca4725d421ed8","email_id":"e.w.eijtmans@gmail.com","status":"pending","quantity":1,"starts_at":"2021-08-05T13:43:01.011Z","activation_date":"","expiry_date":"2121-08-05T13:43:01.011Z","trial_days":0,"trial_expiry_date":"","next_billing_date":"","last_billing_date":"","canceled_date":null},"customer":{}},"create_time":"2021-08-05T13:43:01.011+00:00"}',
    isBase64Encoded: false
  }