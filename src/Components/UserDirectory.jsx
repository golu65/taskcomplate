import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './UserDirectory.css'

function UserDirectory({ users }) {
  return (
    <Fragment>
      <div class="container">
        <h1 class="name">User Directory</h1>
        <div class="directory">
          <ul class="post-list">
            {users.map((user, index) => (
              <Link to={`/user/${user.id}`} style={{ textDecoration: 'none' }}>
                <li key={user.id}>
                  <div class="user-info">

                    <div class="username">Name: {user.name}</div>
                    <div class="posts">

                      Posts {index + 1}

                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>


    </Fragment>
  );
}

export default UserDirectory;
