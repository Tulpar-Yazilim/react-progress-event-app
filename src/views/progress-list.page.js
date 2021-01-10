import moment from "moment";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import ProgressEventDataService from "../services/progress-event.service";

function ProgressListPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [progressEvents, setProgressEvents] = React.useState([]);

  const onDataChange = (items) => {
    setIsLoading(true);
    let datas = [];
    if (items) {
      items.forEach((item) => {
        let key = item.key;
        let data = item.val();
        datas.push({
          key: key,
          title: data.ProgressTitle,
          createdAt: data.CreatedAt,
          updatedAt: data.UpdatedAt,
        });
      });
    }
    setProgressEvents(datas);
    setIsLoading(false);
  };

  const handleDelete = async (itemKey) => {
    const isConfirmed = window.confirm(
      "Görev çizelgesini silmek istediğinize emin misiniz?"
    );
    if (isConfirmed) {
      await ProgressEventDataService.delete(itemKey);
    }
  };

  React.useEffect(() => {
    ProgressEventDataService.getAll().on("value", onDataChange);
    return () => {
      ProgressEventDataService.getAll().off("value", onDataChange);
    };
  }, []);

  return (
    <>
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <Col md="10">
            <PageTitle
              title="Görev Çizelgeleri"
              subtitle="GÖREV TAKİBİNİZİ YAPIN"
              className="text-sm-left"
            />
          </Col>
          <Col className="d-flex h-100 justify-content-end" md="2">
            <Button theme="success" href="/progress-add">
              <i className="fa fa-plus"></i> Görev Çizelgesi Oluştur
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Görev Çizelgeleri</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th width="50" scope="col" className="border-0">
                        #
                      </th>
                      <th width="300" scope="col" className="border-0">
                        Başlık
                      </th>
                      <th width="300" scope="col" className="border-0">
                        Oluşturma Tarihi
                      </th>
                      <th width="100" scope="col" className="border-0">
                        #
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colspan="4">
                          <h5 className="d-flex justify-content-center align-items-center">
                            Verileriniz Yükleniyor ...
                          </h5>
                        </td>
                      </tr>
                    )}
                    {!isLoading &&
                      progressEvents?.map((progressEvent, index) => {
                        return (
                          <tr key={progressEvent.key}>
                            <td>{index + 1}</td>
                            <td>{progressEvent.title}</td>
                            <td>
                              {moment(progressEvent.createdAt).format(
                                "DD.MM.YYYY HH:mm"
                              )}

                              {progressEvent.updatedAt && (
                                <span className="ml-3">
                                  (Güncelleme:{" "}
                                  {moment(progressEvent.updatedAt).format(
                                    "DD.MM.YYYY HH:mm"
                                  )}
                                  )
                                </span>
                              )}
                            </td>
                            <td>
                              <Button
                                href={"/progress-update/" + progressEvent.key}
                              >
                                <i className="fa fa-edit"></i> Güncelle
                              </Button>
                              <Button
                                theme="danger"
                                className="ml-3"
                                onClick={() => handleDelete(progressEvent.key)}
                              >
                                <i className="fa fa-trash"></i> Sil
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ProgressListPage;
