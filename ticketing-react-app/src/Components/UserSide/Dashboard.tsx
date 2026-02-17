import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="sm:m-2 md:m-4 p-4">
        <h1 className="text-center mb-4 text-transparent bg-clip-text bg-linear-to-r to-red-600 from-sky-400 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
          Instructions
        </h1>
        <div className="text-2xl text-heading text-blue-900">
          <p>
            This is a dashboard page where you can send tickets to the support
            team and view your ticket history. You can edit tickets before admin
            resolves it.
          </p>
          <p>
            You can delete tickets if you cancel the issue. When admin resolves
            the issue, you can view that in your history too. You can also clear
            those tickets.
          </p>
          <p>
            If your ticket is <span className="text-red-500">red</span> bordered
            and shows pending then it means the admin has received it. You have
            to wait patiently for the admin to resolve it.
          </p>
          <p>
            They will send a message, telling you if it has been resolved and
            what you can do or what they did. The{" "}
            <span className="text-green-500">green</span> outline with Resolved
            symbol means it is resolved.
          </p>
          <p>
            To view the message sent by the support team, you can click on the
            search icon which will trigger the modal which shows you the
            message.
          </p>
          <p>For furthur queries, you can raise a ticket.</p>
          <p>Thank you and regards,</p>
          <p>Support team.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
