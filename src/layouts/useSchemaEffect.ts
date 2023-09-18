import { useSchema } from "@rp/iwlc-workbench-tools";
import { useEffect } from "react";
import schemaDemo from '../constants/schemaDemo1.json';

export default () => {

  const { updateSchema } = useSchema();

  useEffect(() => {
    updateSchema(schemaDemo);
  }, []);

};
