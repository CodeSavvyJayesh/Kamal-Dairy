import { useCallback, useEffect, useState } from "react";
import { FiPrinter, FiRefreshCw } from "react-icons/fi";
import { getAdminOrders } from "../../api/orders";
import { formatDateTime, rupees } from "../../utils/format";
import "./AdminSubscriptions.css";
import "./AdminOrders.css";

const PAGE_SIZE = 20;

/**
 * Cart orders with where each one goes: who, which phone, which address,
 * what is in it and how it was paid. Newest first, printable.
 */
function AdminOrders({ onError }) {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (p) => {
      setLoading(true);
      try {
        const data = await getAdminOrders(p, PAGE_SIZE);
        setOrders((list) => (p === 0 ? data.content : [...list, ...data.content]));
        setHasMore(!data.last);
        setTotal(data.totalElements);
        setPage(p);
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  useEffect(() => {
    load(0);
  }, [load]);

  return (
    <div className="asubs aorders">
      <section className="kd-panel asubs__panel">
        <header className="asubs__head">
          <div>
            <h2>Orders</h2>
            <p>
              {total} {total === 1 ? "order" : "orders"} · newest first · each with its delivery address
            </p>
          </div>

          <div className="asubs__tools">
            <button
              className="kd-btn kd-btn--ghost kd-btn--sm"
              onClick={() => load(0)}
              disabled={loading}
              aria-label="Refresh"
            >
              <FiRefreshCw aria-hidden="true" />
            </button>
            <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => window.print()}>
              <FiPrinter aria-hidden="true" /> Print
            </button>
          </div>
        </header>

        {loading && orders.length === 0 ? (
          <div className="asubs__skel">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="kd-skel" key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="asubs__empty">
            <span aria-hidden="true">📦</span>
            <p>No orders yet. They appear here the moment a customer pays.</p>
          </div>
        ) : (
          <div className="asubs__table-wrap">
            <table className="asubs__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Deliver to</th>
                  <th>Items</th>
                  <th className="num">Paid</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>#{o.id}</strong>
                      <small>{formatDateTime(o.createdAt)}</small>
                    </td>

                    <td>
                      <strong>{o.deliveryName || "–"}</strong>
                      {o.deliveryPhone && (
                        <small>
                          <a href={`tel:${o.deliveryPhone}`}>{o.deliveryPhone}</a>
                        </small>
                      )}
                      <small className="aorders__email">{o.userEmail}</small>
                    </td>

                    <td className="asubs__addr">
                      {o.deliveryAddress ? (
                        <>
                          {o.deliveryAddress}, {o.deliveryCity}
                          <small className="aorders__pin">{o.deliveryPincode}</small>
                        </>
                      ) : (
                        <small>No address – placed before addresses were saved</small>
                      )}
                    </td>

                    <td>
                      <ul className="aorders__items">
                        {(o.items || []).map((i) => (
                          <li key={i.id}>
                            {i.productName} <b>× {i.quantity}</b>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="num">
                      <strong>{rupees(o.totalAmount)}</strong>
                      <small>{o.paymentMethod === "WALLET" ? "Wallet" : "Razorpay"}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasMore && (
          <button
            className="kd-btn kd-btn--ghost kd-btn--sm aorders__more asubs__no-print"
            onClick={() => load(page + 1)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Show older"}
          </button>
        )}
      </section>
    </div>
  );
}

export default AdminOrders;
