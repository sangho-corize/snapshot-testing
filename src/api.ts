import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

export interface ApiEndpoint {
  name: string;
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  matchers?: Record<
    string,
    "String" | "Number" | "Date" | "Boolean" | "Array" | "Object"
  >;
}

export async function fetchApi(
  url: string,
  method: string = "GET",
): Promise<any> {
  const headers: Record<string, string> = {};

  if (process.env.API_BASE_URL) {
    url = `${process.env.API_BASE_URL}${url}`;
  }

  if (process.env.ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.ACCESS_TOKEN}`;
  }

  if (process.env.CUSTOM_HEADERS) {
    try {
      Object.assign(headers, JSON.parse(process.env.CUSTOM_HEADERS));
    } catch (e) {
      console.warn("Failed to parse CUSTOM_HEADERS");
    }
  }

  const response = await axios({
    method: method as any,
    url,
    headers,
    timeout: 10000,
  });

  return response.data;
}

export const endpoints: ApiEndpoint[] = [
  {
    name: "Action Items",
    url: "/action-items",
  },
  {
    name: "Billing",
    url: "/billing",
  },
  {
    name: "Clients List",
    url: "/clients",
  },
  {
    name: "Clients Detail",
    url: "/clients/ac227cae-40b5-43ed-8ef5-f17ef555bada",
  },
  {
    name: "Clients Positions",
    url: "/clients/ac227cae-40b5-43ed-8ef5-f17ef555bada/positions",
  },
  {
    name: "Clients Projects",
    url: "/clients/ac227cae-40b5-43ed-8ef5-f17ef555bada/projects",
  },
  {
    name: "Countries",
    url: "/countries",
  },
  {
    name: "Currencies",
    url: "/currencies",
  },
  {
    name: "Dashboard Department Health",
    url: "/dashboard/department-health",
  },
  {
    name: "Dashboard Department Health Heatmap",
    url: "/dashboard/department-health-heatmap",
  },
  {
    name: "Dashboard Employee Occupation",
    url: "/dashboard/employee-occupation",
  },
  {
    name: "Dashboard Overview",
    url: "/dashboard/overview",
  },
  {
    name: "Dashboard Internal Business Effort Chart",
    url: "/dashboard/internal-business/effort-chart",
  },
  {
    name: "Dashboard Internal External Effort Chart",
    url: "/dashboard/internal-external-effort-chart",
  },
  {
    name: "Dashboard Internal Business Employees",
    url: "/dashboard/internal-business/employees",
  },
  {
    name: "Dashboard Clients Monthly Sales By Client",
    url: "/dashboard/clients/00fcf4bf-c24c-4799-ac36-873cac416229/monthly-sales",
  },
  {
    name: "Dashboard Clients Monthly Sales Overall",
    url: "/dashboard/clients/monthly-sales",
  },
  {
    name: "Dashboard Clients Spending On Departments By Client",
    url: "/dashboard/clients/00fcf4bf-c24c-4799-ac36-873cac416229/spending-on-departments",
  },
  {
    name: "Dashboard Clients Spending On Departments Overall",
    url: "/dashboard/clients/spending-on-departments",
  },
  {
    name: "Dashboard Projects Capacity Overall",
    url: "/dashboard/projects-capacity/overall",
  },
  {
    name: "Departments List",
    url: "/departments",
  },
  {
    name: "Departments Detail",
    url: "/departments/06ca21cc-c341-48df-a34f-6b77eb0b6e51",
  },
  {
    name: "Departments Positions",
    url: "/departments/06ca21cc-c341-48df-a34f-6b77eb0b6e51/positions",
  },
  {
    name: "Employees List",
    url: "/employees",
  },
  {
    name: "Employees Detail",
    url: "/employees/fc2868a3-c15f-48ec-98ba-102b807443a7",
  },
  {
    name: "Employees Leaves",
    url: "/employees/fc2868a3-c15f-48ec-98ba-102b807443a7/leaves",
  },
  {
    name: "Employees Work Load",
    url: "/employees/fc2868a3-c15f-48ec-98ba-102b807443a7/work-load",
  },
  {
    name: "Employees Team Members",
    url: "/employees/fc2868a3-c15f-48ec-98ba-102b807443a7/team-members",
  },
  {
    name: "Health",
    url: "/health",
  },
  {
    name: "Interests List",
    url: "/interests",
  },
  {
    name: "Interests Detail",
    url: "/interests/001c7f3f-5fff-464e-b945-a9f37c136042",
  },
  {
    name: "Invoices List",
    url: "/invoices",
  },
  {
    name: "Invoices Detail",
    url: "/invoices/001c7f3f-5fff-464e-b945-a9f37c136042",
  },
  {
    name: "Notifications",
    url: "/notifications",
  },
  {
    name: "Onboardings List",
    url: "/onboardings",
  },
  {
    name: "Onboardings Detail",
    url: "/onboardings/0c41d001-8cac-4293-9536-e3bfcff39c8d",
  },
  {
    name: "Organizations List",
    url: "/organizations",
  },
  {
    name: "Organizations Type",
    url: "/organizations/type",
  },
  {
    name: "Permissions",
    url: "/permissions",
  },
  {
    name: "Positions Employees",
    url: "/positions/0215f9dc-f2e0-413b-9c08-7f48e27b1402/employees",
  },
  {
    name: "Projects",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6",
  },
  {
    name: "Projects Logs",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6/logs",
  },
  {
    name: "Projects Status Reports",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6/status-reports",
  },
  {
    name: "Projects Cost Chart",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6/cost-chart",
  },
  {
    name: "Projects Search Employees",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6/search-employees",
  },
  {
    name: "Projects Share",
    url: "/projects/000386a7-f373-4c21-b07a-55a0445398b6/share",
  },
  {
    name: "Project Templates List",
    url: "/project-templates",
  },
  {
    name: "Project Templates Detail",
    url: "/project-templates/000386a7-f373-4c21-b07a-55a0445398b6",
  },
  {
    name: "Project Template Categories List",
    url: "/project-template-categories",
  },
  {
    name: "Project Template Categories Detail",
    url: "/project-template-categories/000386a7-f373-4c21-b07a-55a0445398b6",
  },
  {
    name: "Roles List",
    url: "/roles",
  },
  {
    name: "Roles Detail",
    url: "/roles/0dc62cd0-2539-452c-9050-0110feed9060",
  },
  {
    name: "Skills List",
    url: "/skills",
  },
  {
    name: "Skills Detail",
    url: "/skills/015e2e4a-b6bb-4235-a83e-c3c64ffafe1b",
  },
  {
    name: "Subscription",
    url: "/subscription",
  },
  {
    name: "Users",
    url: "/users",
  },
  {
    name: "Users Roles",
    url: "/users/roles",
  },
  {
    name: "Users Skills",
    url: "/users/skills",
  },
  {
    name: "Users Interests",
    url: "/users/interests",
  },
];
