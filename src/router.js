import Vue from "vue";
import Router from "vue-router";
import SelectLighthouse from "@/views/SelectLighthouse";
import Lighthouse from "@/views/Lighthouse";
import Ambix from "@/views/Ambix";
import Services from "@/views/Services";
import Sensors from "@/views/Sensors";
import Liability from "@/views/Liability";
import Approve from "@/views/Approve";
import Results from "@/views/Results";
import services from "@/services";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/lighthouse",
      name: "lighthouseSelect",
      component: SelectLighthouse
    },
    {
      path: "/lighthouse/:lighthouse",
      name: "lighthouse",
      component: Lighthouse
    },
    {
      path: "/alembic",
      name: "ambix",
      component: Ambix
    },
    {
      path: "/services",
      name: "services",
      component: Services
    },
    {
      path: "/sensors/:lighthouse?",
      name: "sensors",
      component: Sensors,
      props: true
    },
    {
      path: "/liability/:liability",
      name: "liability",
      component: Liability,
      props: true
    },
    {
      path: "/approve",
      name: "approve",
      component: Approve
    },
    {
      path: "/results",
      name: "results",
      component: Results
    },
    ...Object.values(services)
      .filter((item) => item.router)
      .map((item) => item.router)
      .reduce((acc, item) => {
        if (Array.isArray(item)) {
          item.forEach((item) => {
            acc.push(item);
          });
        } else {
          acc.push(item);
        }
        return acc;
      }, []),
    { path: "*", redirect: "/" }
  ]
});
