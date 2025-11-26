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
      import React2, { useState as useState2, useEffect } from "react";
      import { ThemeProvider } from "@zendeskgarden/react-theming";

      // vfs:styles/AppStyles.js
      import styled from "styled-components";
      var AppContainer = styled.div`
        padding: 16px;
        width: 100%;
      `;

      // vfs:components/ProblemTicketForm.jsx
      import React, { useState } from "react";
      import { Field, Label, Select, Textarea, Hint } from "@zendeskgarden/react-forms";
      import { Button } from "@zendeskgarden/react-buttons";
      import { Alert } from "@zendeskgarden/react-notifications";

      // vfs:styles/FormStyles.js
      import styled2 from "styled-components";
      var FormContainer = styled2.div`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `;
      var ButtonContainer = styled2.div`
        margin-top: 8px;
      `;

      // vfs:components/ProblemTicketForm.jsx
      var ProblemTicketForm = ({ categories, loading }) => {
        const [category, setCategory] = useState("");
        const [stepsToReproduce, setStepsToReproduce] = useState("");
        const [expectedBehavior, setExpectedBehavior] = useState("");
        const [actualBehavior, setActualBehavior] = useState("");
        const [submitting, setSubmitting] = useState(false);
        const [success, setSuccess] = useState(false);
        const [error, setError] = useState(null);
        const handleSubmit = (e) => __async(void 0, null, function* () {
          e.preventDefault();
          if (!category || !stepsToReproduce || !expectedBehavior || !actualBehavior) {
            setError("All fields are required");
            return;
          }
          setSubmitting(true);
          setError(null);
          setSuccess(false);
          try {
            const ticketFieldsData = yield window.zafClient.get("ticketFields");
            const ticketFields = ticketFieldsData["ticketFields"];
            const stepsField = ticketFields.find(
              (field) => field.label === "Steps to produce behavior"
            );
            const expectedField = ticketFields.find(
              (field) => field.label === "Expected Behavior"
            );
            const actualField = ticketFields.find(
              (field) => field.label === "Actual Behavior"
            );
            const problemStatusField = ticketFields.find(
              (field) => field.label === "Problem Status"
            );
            const customFields = [];
            customFields.push({
              id: "39352414901019",
              value: [category]
            });
            if (stepsField) {
              customFields.push({
                id: stepsField.name.replace("custom_field_", ""),
                value: stepsToReproduce
              });
            }
            if (expectedField) {
              customFields.push({
                id: expectedField.name.replace("custom_field_", ""),
                value: expectedBehavior
              });
            }
            if (actualField) {
              customFields.push({
                id: actualField.name.replace("custom_field_", ""),
                value: actualBehavior
              });
            }
            if (problemStatusField) {
              const newDefectOption = problemStatusField.custom_field_options.find(
                (option) => option.name === "New Defect Identified by Ops"
              );
              if (newDefectOption) {
                customFields.push({
                  id: problemStatusField.name.replace("custom_field_", ""),
                  value: newDefectOption.value
                });
              }
            }
            const currentUserData = yield window.zafClient.get("currentUser");
            const currentUser = currentUserData["currentUser"];
            const selectedCategory = categories.find((cat) => cat.value === category);
            const categoryLabel = selectedCategory ? selectedCategory.label : category;
            const ticketData = {
              ticket: {
                subject: `Problem: ${categoryLabel}`,
                comment: {
                  body: `Steps to Reproduce:
      ${stepsToReproduce}

      Expected Behavior:
      ${expectedBehavior}

      Actual Behavior:
      ${actualBehavior}`
                },
                type: "problem",
                requester_id: currentUser.id,
                custom_fields: customFields
              }
            };
            yield window.zafClient.request({
              url: "/api/v2/tickets.json",
              type: "POST",
              contentType: "application/json",
              data: JSON.stringify(ticketData)
            });
            setSuccess(true);
            setCategory("");
            setStepsToReproduce("");
            setExpectedBehavior("");
            setActualBehavior("");
            setTimeout(() => setSuccess(false), 5e3);
          } catch (err) {
            console.error("Full error object:", err);
            let errorMessage = "An error occurred";
            if (err.responseJSON) {
              errorMessage = JSON.stringify(err.responseJSON, null, 2);
            } else if (err.responseText) {
              errorMessage = err.responseText;
            } else if (err.message) {
              errorMessage = err.message;
            } else {
              errorMessage = JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
            }
            setError(errorMessage);
          } finally {
            setSubmitting(false);
          }
        });
        if (loading) {
          return React.createElement("div", null, "Loading...");
        }
        return React.createElement(FormContainer, null, success && React.createElement(Alert, { type: "success" }, React.createElement(Alert.Title, null, "Success"), "Problem ticket created successfully"), error && React.createElement(Alert, { type: "error" }, React.createElement(Alert.Title, null, "Error"), React.createElement("pre", { style: { whiteSpace: "pre-wrap", fontSize: "12px" } }, error)), React.createElement("form", { onSubmit: handleSubmit }, React.createElement(Field, null, React.createElement(Label, null, "Category"), React.createElement(
          Select,
          {
            value: category,
            onChange: (e) => setCategory(e.target.value),
            disabled: submitting
          },
          React.createElement("option", { value: "" }, "Select category..."),
          categories.map((cat) => React.createElement("option", { key: cat.value, value: cat.value }, cat.label))
        )), React.createElement(Field, null, React.createElement(Label, null, "Steps to Reproduce"), React.createElement(
          Textarea,
          {
            value: stepsToReproduce,
            onChange: (e) => setStepsToReproduce(e.target.value),
            disabled: submitting,
            rows: 4
          }
        ), React.createElement(Hint, null, "Describe how to reproduce the problem")), React.createElement(Field, null, React.createElement(Label, null, "Expected Behavior"), React.createElement(
          Textarea,
          {
            value: expectedBehavior,
            onChange: (e) => setExpectedBehavior(e.target.value),
            disabled: submitting,
            rows: 3
          }
        ), React.createElement(Hint, null, "What should happen")), React.createElement(Field, null, React.createElement(Label, null, "Actual Behavior"), React.createElement(
          Textarea,
          {
            value: actualBehavior,
            onChange: (e) => setActualBehavior(e.target.value),
            disabled: submitting,
            rows: 3
          }
        ), React.createElement(Hint, null, "What actually happens")), React.createElement(ButtonContainer, null, React.createElement(Button, { type: "submit", isPrimary: true, disabled: submitting }, submitting ? "Creating..." : "Create Problem Ticket"))));
      };

      // vfs:index.jsx
      var App = () => {
        const [categories, setCategories] = useState2([]);
        const [loading, setLoading] = useState2(true);
        useEffect(() => {
          const initializeApp = () => __async(void 0, null, function* () {
            try {
              yield window.zafClient.invoke("resize", { width: "100%", height: "550px" });
              const response = yield window.zafClient.request({
                url: "/api/v2/ticket_fields/39352414901019.json",
                type: "GET"
              });
              if (response.ticket_field && response.ticket_field.custom_field_options) {
                const options = response.ticket_field.custom_field_options.map((option) => ({
                  value: option.value,
                  label: option.name
                }));
                setCategories(options);
              }
              setLoading(false);
            } catch (error) {
              console.error("Error initializing app:", error);
              setLoading(false);
            }
          });
          initializeApp();
        }, []);
        return React2.createElement(ThemeProvider, null, React2.createElement(AppContainer, null, React2.createElement(ProblemTicketForm, { categories, loading })));
      };
      var index_default = App;
      var ErrorBoundary = class extends React2.Component {
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
            return React2.createElement("div", { style: {
              fontSize: "16px",
              display: "grid",
              padding: "20px"
            } }, React2.createElement("div", { style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            } }, React2.createElement("h4", { style: {
              marginBottom: "8px",
              color: "#d93f4c"
            } }, "An error occurred in your application"), React2.createElement("p", { style: {
              marginBottom: "16px",
              color: "#49545c",
              maxWidth: "600px"
            } }, "To resolve this issue, please copy the error message below and paste it back into the app builder. App Builder will automatically attempt to fix this issue."), React2.createElement(
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
              this.state.copied ? React2.createElement(React2.Fragment, null, React2.createElement("span", { style: { color: "#1f73b7" } }, "Copied!")) : React2.createElement(React2.Fragment, null, "Copy error")
            ), React2.createElement("pre", { style: {
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
      var AppWithErrorBoundary = () => React2.createElement(ErrorBoundary, null, React2.createElement(App, null));
      try {
        createRoot(document.getElementById("root")).render(React2.createElement(AppWithErrorBoundary, null));
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
