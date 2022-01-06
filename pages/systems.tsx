import type { ReactElement } from "react";
import Layout from "../components/layout";
import Sidebar from "../components/sidebar";
import { Button, ThemeIcon, Title } from "@mantine/core";
import { ReactTable } from "../components/table";
import { Database, HardDrives, Plus } from "phosphor-react";
import Link from "next/link";
import Header from "../components/header";
import DocViewer, {
  DocViewerRenderers,
  IHeaderOverride,
} from "react-doc-viewer";

type Server = {
  id: number;
  assetNumber: string;
  brand: string;
  model: string;
  serial: string;
  macAddress: string;
};

export default function About() {
  const docs = [
    { uri: "/test.pdf" },
    // {
    //   uri: "https://www.americanexpress.com/content/dam/amex/us/staticassets/pdf/GCO/Test_PDF.pdf",
    //   fileType: "pdf",
    // },
  ];

  const myHeader: IHeaderOverride = (state, previousDocument, nextDocument) => {
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null;
    }

    return (
      <>
        <div>{state.currentDocument.uri || ""}</div>
        <div>
          <button
            onClick={previousDocument}
            disabled={state.currentFileNo === 0}
          >
            Previous Document
          </button>
          <button
            onClick={nextDocument}
            disabled={state.currentFileNo >= state.documents.length - 1}
          >
            Next Document
          </button>
        </div>
      </>
    );
  };

  return (
    <section
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        icon={
          <ThemeIcon size="lg" color="teal" variant="light">
            <Database weight="bold" />
          </ThemeIcon>
        }
        title="Systems"
        subTitle="On-site databases"
        rightArea={
          <Link href="servers/add">
            <Button
              component="a"
              variant="light"
              color="cyan"
              leftIcon={<Plus weight="bold" />}
            >
              Add Server
            </Button>
          </Link>
        }
      />
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={docs}
        style={{ width: "100%", height: "100%" }}
        config={{
          header: {
            overrideComponent: myHeader,
          },
        }}
      />
    </section>
  );
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
