const API_URL = process.env.API_URL || "http://localhost:5000/api";

function ensure(ok, message) {
  if (!ok) {
    throw new Error(message);
  }
}

async function request(path, options = {}, token) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} on ${path}: ${JSON.stringify(body)}`);
  }

  return body;
}

function randomEmail(prefix) {
  const nonce = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return `${prefix}.${nonce}@example.com`;
}

async function main() {
  console.log(`[smoke] API: ${API_URL}`);

  const sellerEmail = randomEmail("seller.smoke");
  const buyerEmail = randomEmail("buyer.smoke");
  const password = "Test12345";

  console.log("[smoke] Register seller");
  const sellerAuth = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: sellerEmail,
      password,
      firstName: "Seller",
      lastName: "Smoke",
      role: "seller",
    }),
  });
  ensure(!!sellerAuth?.token, "Seller token missing");

  console.log("[smoke] Register buyer");
  const buyerAuth = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email: buyerEmail,
      password,
      firstName: "Buyer",
      lastName: "Smoke",
      role: "buyer",
    }),
  });
  ensure(!!buyerAuth?.token, "Buyer token missing");

  const now = new Date();
  const auctionStart = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const auctionEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  console.log("[smoke] Create property");
  const created = await request(
    "/properties",
    {
      method: "POST",
      body: JSON.stringify({
        title: "Smoke API Property",
        description: "Created by API smoke test",
        address: "100 Smoke Ave",
        city: "Bogota",
        state: "Cundinamarca",
        zipCode: "110111",
        price: 250000,
        auctionStartDate: auctionStart,
        auctionEndDate: auctionEnd,
        rentalPrice: 1800,
        isAvailableForAuction: true,
        isAvailableForRent: true,
      }),
    },
    sellerAuth.token
  );

  ensure(!!created?.id, "Created property id missing");
  ensure(Object.prototype.hasOwnProperty.call(created, "ownerId"), "ownerId camelCase missing in create response");
  ensure(Object.prototype.hasOwnProperty.call(created, "isAvailableForAuction"), "isAvailableForAuction camelCase missing in create response");

  console.log("[smoke] Get property detail and verify camelCase");
  const detail = await request(`/properties/${created.id}`);
  ensure(Object.prototype.hasOwnProperty.call(detail, "zipCode"), "zipCode camelCase missing in property detail");
  ensure(Object.prototype.hasOwnProperty.call(detail, "auctionStartDate"), "auctionStartDate camelCase missing in property detail");
  ensure(detail.isAvailableForAuction === true, "Property should be available for auction");
  ensure(detail.isAvailableForRent === true, "Property should be available for rent");

  console.log("[smoke] Place bid as buyer");
  const bid = await request(
    "/auctions/bids",
    {
      method: "POST",
      body: JSON.stringify({
        propertyId: created.id,
        amount: 260000,
      }),
    },
    buyerAuth.token
  );
  ensure(!!bid?.id, "Bid id missing");
  ensure(Object.prototype.hasOwnProperty.call(bid, "createdAt"), "createdAt camelCase missing in bid response");

  console.log("[smoke] Validate my-bids");
  const myBids = await request("/auctions/my-bids", {}, buyerAuth.token);
  ensure(Array.isArray(myBids), "my-bids should return an array");
  ensure(myBids.some((b) => b.id === bid.id), "Created bid not found in my-bids");

  console.log("[smoke] Request rental as buyer");
  const rental = await request(
    "/rentals",
    {
      method: "POST",
      body: JSON.stringify({
        propertyId: created.id,
        startDate: "2026-08-10",
        endDate: "2026-09-10",
      }),
    },
    buyerAuth.token
  );
  ensure(!!rental?.id, "Rental id missing");
  ensure(Object.prototype.hasOwnProperty.call(rental, "monthlyPrice"), "monthlyPrice camelCase missing in rental response");

  console.log("[smoke] Validate my-rentals");
  const myRentals = await request("/rentals/my-rentals", {}, buyerAuth.token);
  ensure(Array.isArray(myRentals), "my-rentals should return an array");
  ensure(myRentals.some((r) => r.id === rental.id), "Created rental not found in my-rentals");

  console.log("[smoke] PASS");
}

main().catch((error) => {
  console.error(`[smoke] FAIL: ${error.message}`);
  process.exit(1);
});
