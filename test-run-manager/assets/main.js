var __defProp = Object.defineProperty;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };

      // vfs:index.jsx
      import { createRoot } from "react-dom/client";
      import React4, { useState as useState3, useEffect } from "react";
      import { ThemeProvider } from "@zendeskgarden/react-theming";

      // vfs:components/TestRunForm.jsx
      import React, { useState } from "react";
      import { Field, Label, Input, Checkbox, Textarea } from "@zendeskgarden/react-forms";
      import { Button } from "@zendeskgarden/react-buttons";
      import { Dropdown, Select, Field as DropdownField, Label as DropdownLabel, Menu, Item } from "@zendeskgarden/react-dropdowns";

      // vfs:styles/FormStyles.js
      import styled from "styled-components";
      var FormContainer = styled.div`
        padding: 16px;
        border: 1px solid #d8dcde;
        border-radius: 4px;
        margin-bottom: 24px;
        background: white;
      `;
      var FormTitle = styled.h3`
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: #2f3941;
      `;
      var FormRow = styled.div`
        margin-bottom: 16px;
      `;
      var ButtonContainer = styled.div`
        display: flex;
        gap: 8px;
        margin-top: 16px;
      `;
      var Message = styled.div`
        padding: 12px;
        border-radius: 4px;
        margin-top: 16px;
        background-color: ${(props) => props.type === "success" ? "#edf7ed" : "#fef0ee"};
        color: ${(props) => props.type === "success" ? "#0b6e0b" : "#d93f4c"};
        border: 1px solid ${(props) => props.type === "success" ? "#0b6e0b" : "#d93f4c"};
      `;

      // vfs:components/TestRunForm.jsx
      var TestRunForm = ({ problemTicketId, onTestRunCreated }) => {
        const [browser, setBrowser] = useState("");
        const [passed, setPassed] = useState(false);
        const [comments, setComments] = useState("");
        const [submitting, setSubmitting] = useState(false);
        const [message, setMessage] = useState(null);
        const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
        const handleSubmit = (e) => __async(void 0, null, function* () {
          e.preventDefault();
          if (!browser) {
            setMessage({ type: "error", text: "Please select a browser" });
            return;
          }
          setSubmitting(true);
          setMessage(null);
          try {
            const status = passed ? "Passed" : "Failed";
            const subject = `Test Run - Browser: ${browser} - Status: ${status}`;
            const tags = [
              "test_run",
              `problem_${problemTicketId}`,
              `browser_${browser.toLowerCase()}`,
              `status_${passed ? "passed" : "failed"}`
            ];
            const ticketData = {
              ticket: {
                subject,
                comment: {
                  body: comments || "Test run completed"
                },
                type: "task",
                status: "closed",
                tags
              }
            };
            yield window.zafClient.request({
              url: "/api/v2/tickets.json",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(ticketData)
            });
            setMessage({ type: "success", text: "Test run created successfully!" });
            setBrowser("");
            setPassed(false);
            setComments("");
            if (onTestRunCreated) {
              onTestRunCreated();
            }
          } catch (error) {
            console.error("Error creating test run:", error);
            setMessage({ type: "error", text: `Error creating test run: ${JSON.stringify(error)}` });
          } finally {
            setSubmitting(false);
          }
        });
        return React.createElement(FormContainer, null, React.createElement(FormTitle, null, "Create Test Run"), React.createElement("form", { onSubmit: handleSubmit }, React.createElement(FormRow, null, React.createElement(
          Dropdown,
          {
            selectedItem: browser,
            onSelect: setBrowser
          },
          React.createElement(DropdownField, null, React.createElement(DropdownLabel, null, "Browser"), React.createElement(Select, null, browser || "Select browser...")),
          React.createElement(Menu, null, browsers.map((b) => React.createElement(Item, { key: b, value: b }, b)))
        )), React.createElement(FormRow, null, React.createElement(Field, null, React.createElement(
          Checkbox,
          {
            checked: passed,
            onChange: (e) => setPassed(e.target.checked)
          },
          React.createElement(Label, null, "Test Passed")
        ))), React.createElement(FormRow, null, React.createElement(Field, null, React.createElement(Label, null, "Comments (Optional)"), React.createElement(
          Textarea,
          {
            value: comments,
            onChange: (e) => setComments(e.target.value),
            rows: 3,
            placeholder: "Add any additional notes about this test run..."
          }
        ))), React.createElement(ButtonContainer, null, React.createElement(Button, { type: "submit", isPrimary: true, disabled: submitting }, submitting ? "Creating..." : "Create Test Run")), message && React.createElement(Message, { type: message.type }, message.text)));
      };

      // vfs:components/TestRunChart.jsx
      import React2 from "react";
      import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

      // vfs:styles/ChartStyles.js
      import styled2 from "styled-components";
      var ChartContainer = styled2.div`
        padding: 16px;
        border: 1px solid #d8dcde;
        border-radius: 4px;
        margin-bottom: 24px;
        background: white;

        h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #2f3941;
        }
      `;

      // vfs:components/TestRunChart.jsx
      var TestRunChart = ({ testRuns }) => {
        const processChartData = () => {
          const dateMap = {};
          testRuns.forEach((run) => {
            const date = new Date(run.created_at).toLocaleDateString();
            const isPassed = run.tags.includes("status_passed");
            if (!dateMap[date]) {
              dateMap[date] = { date, passed: 0, failed: 0 };
            }
            if (isPassed) {
              dateMap[date].passed += 1;
            } else {
              dateMap[date].failed -= 1;
            }
          });
          return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        };
        const chartData = processChartData();
        return React2.createElement(ChartContainer, null, React2.createElement("h3", null, "Test Run Analytics"), React2.createElement(ResponsiveContainer, { width: "100%", height: 300 }, React2.createElement(BarChart, { data: chartData }, React2.createElement(CartesianGrid, { strokeDasharray: "3 3" }), React2.createElement(XAxis, { dataKey: "date" }), React2.createElement(YAxis, null), React2.createElement(
          Tooltip,
          {
            formatter: (value) => Math.abs(value),
            labelFormatter: (label) => `Date: ${label}`
          }
        ), React2.createElement(ReferenceLine, { y: 0, stroke: "#000" }), React2.createElement(Bar, { dataKey: "passed", fill: "#0081a0", name: "Passed" }), React2.createElement(Bar, { dataKey: "failed", fill: "#ef5e39", name: "Failed" }))));
      };

      // vfs:components/TestRunTable.jsx
      import React3, { useState as useState2 } from "react";
      import { Table, Head, HeaderRow, HeaderCell, Body, Row, Cell } from "@zendeskgarden/react-tables";

      // vfs:styles/TableStyles.js
      import styled3 from "styled-components";
      var TableContainer = styled3.div`
        padding: 16px;
        border: 1px solid #d8dcde;
        border-radius: 4px;
        background: white;

        h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #2f3941;
        }
      `;

      // vfs:components/TestRunTable.jsx
      var TestRunTable = ({ testRuns }) => {
        const [sortConfig, setSortConfig] = useState2({ key: "date", direction: "desc" });
        const extractBrowser = (tags) => {
          const browserTag = tags.find((tag) => tag.startsWith("browser_"));
          return browserTag ? browserTag.replace("browser_", "") : "Unknown";
        };
        const extractStatus = (tags) => {
          return tags.includes("status_passed") ? "Passed" : "Failed";
        };
        const handleSort = (key) => {
          let direction = "asc";
          if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
          }
          setSortConfig({ key, direction });
        };
        const sortedTestRuns = [...testRuns].sort((a, b) => {
          let aValue, bValue;
          if (sortConfig.key === "date") {
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
          } else if (sortConfig.key === "browser") {
            aValue = extractBrowser(a.tags);
            bValue = extractBrowser(b.tags);
          } else if (sortConfig.key === "status") {
            aValue = extractStatus(a.tags);
            bValue = extractStatus(b.tags);
          }
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
        const handleTicketClick = (e, ticketId) => {
          e.preventDefault();
          window.zafClient.invoke("routeTo", "ticket", ticketId);
        };
        return React3.createElement(TableContainer, null, React3.createElement("h3", null, "Test Run History"), React3.createElement(Table, null, React3.createElement(Head, null, React3.createElement(HeaderRow, null, React3.createElement(HeaderCell, { onClick: () => handleSort("date"), style: { cursor: "pointer" } }, "Date ", sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")), React3.createElement(HeaderCell, { onClick: () => handleSort("browser"), style: { cursor: "pointer" } }, "Browser ", sortConfig.key === "browser" && (sortConfig.direction === "asc" ? "↑" : "↓")), React3.createElement(HeaderCell, { onClick: () => handleSort("status"), style: { cursor: "pointer" } }, "Status ", sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")), React3.createElement(HeaderCell, null, "Test Run"))), React3.createElement(Body, null, sortedTestRuns.map((testRun) => {
          const status = extractStatus(testRun.tags);
          const statusColor = status === "Passed" ? "#0081a0" : "#ef5e39";
          return React3.createElement(Row, { key: testRun.id }, React3.createElement(Cell, null, new Date(testRun.created_at).toLocaleDateString()), React3.createElement(Cell, null, extractBrowser(testRun.tags)), React3.createElement(Cell, { style: { color: statusColor, fontWeight: "bold" } }, status), React3.createElement(Cell, null, React3.createElement(
            "a",
            {
              href: "#",
              onClick: (e) => handleTicketClick(e, testRun.id),
              style: { color: "#1f73b7", textDecoration: "none" }
            },
            "#",
            testRun.id
          )));
        }))));
      };

      // vfs:styles/AppContainer.js
      import styled4 from "styled-components";
      var AppContainer = styled4.div`
        padding: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      `;

      // vfs:index.jsx
      var App = () => {
        const [ticketId, setTicketId] = useState3(null);
        const [testRuns, setTestRuns] = useState3([]);
        const [loading, setLoading] = useState3(true);
        const [theme, setTheme] = useState3("light");
        useEffect(() => {
          const initializeApp = () => __async(void 0, null, function* () {
            try {
              yield window.zafClient.invoke("resize", { width: "100%", height: "600px" });
              const context = yield window.zafClient.context();
              setTheme(context.theme || "light");
              const ticketData = yield window.zafClient.get("ticket.id");
              const currentTicketId = ticketData["ticket.id"];
              setTicketId(currentTicketId);
              yield fetchTestRuns(currentTicketId);
              setLoading(false);
            } catch (error) {
              console.error("Error initializing app:", error);
              setLoading(false);
            }
          });
          initializeApp();
        }, []);
        const fetchTestRuns = (problemTicketId) => __async(void 0, null, function* () {
          try {
            const searchQuery = `type:ticket tags:test_run tags:problem_${problemTicketId}`;
            const response = yield window.zafClient.request({
              url: "/api/v2/search.json",
              type: "GET",
              data: {
                query: searchQuery,
                sort_by: "created_at",
                sort_order: "desc"
              }
            });
            setTestRuns(response.results || []);
          } catch (error) {
            console.error("Error fetching test runs:", error);
            setTestRuns([]);
          }
        });
        const handleTestRunCreated = () => {
          if (ticketId) {
            fetchTestRuns(ticketId);
          }
        };
        if (loading) {
          return React4.createElement(ThemeProvider, { theme: { colors: { base: theme } } }, React4.createElement(AppContainer, null, React4.createElement("p", null, "Loading...")));
        }
        return React4.createElement(ThemeProvider, { theme: { colors: { base: theme } } }, React4.createElement(AppContainer, null, React4.createElement(
          TestRunForm,
          {
            problemTicketId: ticketId,
            onTestRunCreated: handleTestRunCreated
          }
        ), testRuns.length > 0 && React4.createElement(React4.Fragment, null, React4.createElement(TestRunChart, { testRuns }), React4.createElement(TestRunTable, { testRuns })), testRuns.length === 0 && React4.createElement("p", { style: { textAlign: "center", color: "#68737d", marginTop: "24px" } }, "No test runs found for this problem ticket.")));
      };
      var index_default = App;
      var ErrorBoundary = class extends React4.Component {
        constructor(props) {
          super(props);
          __publicField(this, "copyErrorToClipboard", () => {
            var _a, _b;
            const errorMessage = ((_a = this.state.error) == null ? void 0 : _a.toString()) || "Unknown error";
            const errorStack = ((_b = this.state.error) == null ? void 0 : _b.stack) || "";
            const fullErrorText = errorStack || errorMessage;
            navigator.clipboard.writeText(fullErrorText);
            this.setState({ copied: true });
            setTimeout(() => {
              this.setState({ copied: false });
            }, 2e3);
          });
          this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            copied: false
          };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          this.setState({ errorInfo });
          const errorMessage = error.toString();
          const errorStack = error.stack || "";
          window.parent.postMessage({
            type: "iframe-error",
            error: errorMessage,
            stack: errorStack
          }, "*");
        }
        render() {
          var _a, _b;
          if (this.state.hasError) {
            const errorStack = ((_a = this.state.error) == null ? void 0 : _a.stack) || ((_b = this.state.error) == null ? void 0 : _b.toString()) || "Unknown error";
            return React4.createElement("div", { style: {
              fontSize: "16px",
              display: "grid",
              padding: "20px"
            } }, React4.createElement("div", { style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            } }, React4.createElement("h4", { style: {
              marginBottom: "8px",
              color: "#d93f4c"
            } }, "An error occurred in your application"), React4.createElement("p", { style: {
              marginBottom: "16px",
              color: "#49545c",
              maxWidth: "600px"
            } }, "To resolve this issue, please copy the error message below and paste it back into the app builder. App Builder will automatically attempt to fix this issue."), React4.createElement(
              "button",
              {
                onClick: this.copyErrorToClipboard,
                title: "Click to copy error message",
                style: {
                  marginBottom: "16px",
                  padding: "8px 16px",
                  border: "1px solid #c1c3c5",
                  borderRadius: "4px",
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  ":hover": {
                    background: "#f8f9f9",
                    borderColor: "#68737d"
                  }
                }
              },
              this.state.copied ? React4.createElement(React4.Fragment, null, React4.createElement("span", { style: { color: "#1f73b7" } }, "Copied!")) : React4.createElement(React4.Fragment, null, "Copy error")
            ), React4.createElement("pre", { style: {
              background: "#f8f9f9",
              padding: "16px",
              borderRadius: "4px",
              maxWidth: "600px",
              overflow: "auto",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              lineHeight: "1.5"
            } }, errorStack)));
          }
          return this.props.children;
        }
      };
      var AppWithErrorBoundary = () => React4.createElement(ErrorBoundary, null, React4.createElement(App, null));
      try {
        createRoot(document.getElementById("root")).render(React4.createElement(AppWithErrorBoundary, null));
      } catch (error) {
        console.log({ error });
        window.parent.postMessage({
          type: "iframe-error",
          error: error.toString(),
          stack: error.stack || ""
        }, "*");
      }
      export {
        index_default as default
      };
