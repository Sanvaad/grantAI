import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import ProposalForm from "./components/TemplateLibrary";
import ProposalDashboard from "./pages/ProposalDashboard";
import CreateProposal from "./pages/CreateProposal";
import TemplatesPage from "./pages/TemplatesPage";
import ProposalEditor from "./pages/ProposalEditor";
import MyProposals from "./pages/MyProposals";
import SubmissionReview from "./pages/SubmissionReview";

import UserProfileSettings from "./pages/UserProfileSettings";
import Layout from "./layouts/Layout";
import GeneratedProposal from "./pages/GeneratedProposal";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/e" element={<ProposalForm />} />
          <Route path="/" element={<ProposalDashboard />} />
          <Route path="/create" element={<CreateProposal />} />
          <Route path="/template" element={<TemplatesPage />} />
          <Route path="/edit" element={<ProposalEditor />} />
          <Route path="/proposals" element={<MyProposals />} />
          <Route path="/review" element={<SubmissionReview />} />
          <Route path="/settings" element={<UserProfileSettings />} />
          <Route path="/generated-proposal" element={<GeneratedProposal />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
