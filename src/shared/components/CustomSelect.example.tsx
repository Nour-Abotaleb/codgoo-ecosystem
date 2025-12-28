/**
 * CustomSelect Component - Usage Examples
 * 
 * This file demonstrates how to use the CustomSelect component throughout your project.
 */

import { useState } from "react";
import { CustomSelect } from "./CustomSelect";
import { ArrowUpIcon } from "@utilities/icons";

// Example 1: Basic Usage
export const BasicExample = () => {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
    { value: "3", label: "Option 3" },
  ];

  return (
    <CustomSelect
      options={options}
      placeholder="Select an option"
      onChange={(value) => console.log("Selected:", value)}
    />
  );
};

// Example 2: With Custom Icon (like in DashboardOverview)
export const WithIconExample = () => {
  const domains = [
    { value: "1", label: "example.com" },
    { value: "2", label: "mysite.com" },
    { value: "3", label: "demo.com" },
  ];

  return (
    <CustomSelect
      options={domains}
      placeholder="Choose Domain"
      icon={
        <div className="w-10 h-10 m-1 bg-[#584ABC] rounded-full flex items-center justify-center text-center cursor-pointer flex-shrink-0 -ml-2">
          <ArrowUpIcon className="w-8 h-8 p-1 rounded-full" />
        </div>
      }
    />
  );
};

// Example 3: Dark Mode
export const DarkModeExample = () => {
  const options = [
    { value: "1", label: "Dark Option 1" },
    { value: "2", label: "Dark Option 2" },
  ];

  return (
    <CustomSelect
      options={options}
      placeholder="Select in dark mode"
      isDark={true}
    />
  );
};

// Example 4: With State Management
export const StatefulExample = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const options = [
    { value: "hosting", label: "Web Hosting" },
    { value: "domain", label: "Domain Registration" },
    { value: "ssl", label: "SSL Certificate" },
  ];

  return (
    <div>
      <CustomSelect
        options={options}
        placeholder="Select a service"
        value={selectedValue}
        onChange={setSelectedValue}
      />
      <p>Selected: {selectedValue}</p>
    </div>
  );
};

// Example 5: Custom Styling
export const CustomStyledExample = () => {
  const options = [
    { value: "1", label: "Styled Option 1" },
    { value: "2", label: "Styled Option 2" },
  ];

  return (
    <CustomSelect
      options={options}
      placeholder="Custom styled select"
      className="w-full max-w-md"
      dropdownClassName="shadow-2xl"
    />
  );
};

// Example 6: With Gradient Icon (like Security section)
export const GradientIconExample = () => {
  const domains = [
    { value: "1", label: "secure.com" },
    { value: "2", label: "protected.com" },
  ];

  return (
    <CustomSelect
      options={domains}
      placeholder="Choose Domain"
      icon={
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-center cursor-pointer flex-shrink-0 -ml-2">
          <ArrowUpIcon className="w-6 h-6 p-1 bg-gradient-to-b from-[#8A72FC] to-[#4318FF] rounded-full" />
        </div>
      }
      iconClassName="-ml-2"
    />
  );
};
