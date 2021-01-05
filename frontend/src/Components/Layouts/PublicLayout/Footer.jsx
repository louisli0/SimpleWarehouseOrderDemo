import React from 'react';

export default function Footer() {
  return (
    <React.Fragment>
      <table>
        <tr>
          <th>Sitemap</th>
          <th>Resources</th>
        </tr>
        <tr>
          <td>
            <ul>
              <li>Tickets</li>
              <li>Your items</li>
              <li>About</li>
            </ul>
          </td>
          <td>
            <ul>
              <li>Help</li>
              <li>Login</li>
              <li>About</li>
            </ul>
          </td>
        </tr>
      </table>
    </React.Fragment>
  );
}
