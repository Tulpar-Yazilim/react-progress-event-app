import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "shards-react";
import GanttChart from "../components/common/GanttChart";
import PageTitle from "../components/common/PageTitle";
import ProgressEventDataService from "../services/progress-event.service";

function ProgressAddPage() {
  const { addToast } = useToasts();
  const history = useHistory();

  const ganttChartRef = React.createRef();

  const [tasks, setTasks] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);
  const [showTaskModal, setShowTaskModal] = React.useState(false);

  const [showTitleEdit, setShowTitleEdit] = React.useState(false);

  const [ganttChartTitle, setGanttChartTitle] = React.useState(
    "Görev Çizelgesi"
  );
  const [title, setTitle] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [activeViewMode, setActiveViewMode] = React.useState("Week");

  const newGuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const addTask = () => {
    if (!title) {
      addToast("Lütfen görev başlığını giriniz!", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }
    if (!startDate) {
      addToast("Lütfen başlangıç tarihini seçiniz!", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }
    if (!endDate) {
      addToast("Lütfen bitiş tarihini seçiniz!", {
        appearance: "error",
        autoDismiss: true,
      });
      return false;
    }
    const task = {
      id: newGuid(),
      name: title,
      start: moment(startDate).format("YYYY-MM-DD"),
      end: moment(endDate).format("YYYY-MM-DD"),
      progress: 100,
    };
    ganttChartRef.current.addTask(task);
    handleCloseModal();
  };

  const onSaveProgress = async () => {
    await saveProgress();
    history.push("/progress-list");
  };

  const saveProgress = async () => {
    return new Promise((resolve) => {
      ProgressEventDataService.create({
        ProgressTitle: ganttChartTitle,
        CreatedAt: moment().toISOString(),
        UpdatedAt: null,
        Tasks: ganttChartRef.current.getTasks(),
      }).then(
        (result) => {
          resolve(result);
        },
        (err) => {
          resolve(err);
        }
      );
    });
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseTaskModal = () => setShowTaskModal(false);
  const handleShowTaskModal = () => {
    setTasks(ganttChartRef.current.getTasks());
    setShowTaskModal(true);
  };

  return (
    <>
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <Col md="10">
            <PageTitle
              title="Yeni Görev Çizelgesi Oluştur"
              subtitle="GÖREV ÇİZELGESİ"
              className="text-sm-left"
            />
          </Col>
          <Col className="d-flex h-100 justify-content-end" md="2">
            <Button
              theme="danger"
              onClick={() => history.push("/progress-list")}
            >
              <i className="fa fa-arrow-left"></i> Vazgeç
            </Button>
            <Button className="ml-3" theme="success" onClick={onSaveProgress}>
              <i className="fa fa-save"></i> Kaydet
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md="12">
            <div>
              <Card small className="mb-3">
                <CardHeader className="border-bottom">
                  {!showTitleEdit && (
                    <Row>
                      <Col md="9">
                        <h6 className="m-0">
                          {ganttChartTitle}
                          <Button
                            className="ml-3"
                            onClick={() => setShowTitleEdit(true)}
                          >
                            <i className="fa fa-edit"></i>
                          </Button>
                        </h6>
                      </Col>
                      <Col>
                        <Button onClick={handleShowModal}>
                          <i className="fa fa-plus"></i> Görev Ekle
                        </Button>
                        <Button
                          className="ml-2"
                          theme="danger"
                          onClick={handleShowTaskModal}
                        >
                          <i className="fa fa-trash"></i> Görev Sil
                        </Button>
                        <Button
                          className="ml-2"
                          theme="dark"
                          onClick={() => {
                            html2canvas(
                              document.querySelector("#gantt-chart-container")
                            ).then((canvas) => {
                              var imgData = canvas.toDataURL("image/png");
                              var pdf = new jsPDF("l", "pt", "a4");

                              const imgProps = pdf.getImageProperties(imgData);
                              const pdfWidth = pdf.internal.pageSize.getWidth();
                              const pdfHeight =
                                (imgProps.height * pdfWidth) / imgProps.width;

                              pdf.addImage(
                                canvas,
                                "PNG",
                                0,
                                0,
                                pdfWidth,
                                pdfHeight
                              );
                              pdf.save(ganttChartTitle + ".pdf");
                            });
                          }}
                        >
                          <i className="fa fa-file-pdf"></i> PDF Oluştur
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {showTitleEdit && (
                    <>
                      <Row>
                        <Col md="10">
                          <FormInput
                            required
                            className="mb-3"
                            value={ganttChartTitle}
                            onChange={(event) => {
                              setGanttChartTitle(event.target.value);
                            }}
                            placeholder="Görev Çizelgesi"
                          />
                        </Col>
                        <Col md="2">
                          <Button
                            theme="success"
                            onClick={() => setShowTitleEdit(false)}
                          >
                            <i className="fa fa-check"></i>
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </CardHeader>
                <CardBody>
                  <ButtonGroup className="mb-3">
                    <Button
                      theme={activeViewMode === "Day" ? "primary" : "white"}
                      onClick={() => {
                        setActiveViewMode("Day");
                        ganttChartRef.current.setGanttChartViewMode("Day");
                      }}
                    >
                      Günlük
                    </Button>
                    <Button
                      theme={activeViewMode === "Week" ? "primary" : "white"}
                      onClick={() => {
                        setActiveViewMode("Week");
                        ganttChartRef.current.setGanttChartViewMode("Week");
                      }}
                    >
                      Haftalık
                    </Button>
                    <Button
                      theme={activeViewMode === "Month" ? "primary" : "white"}
                      onClick={() => {
                        setActiveViewMode("Month");
                        ganttChartRef.current.setGanttChartViewMode("Month");
                      }}
                    >
                      Aylık
                    </Button>
                  </ButtonGroup>
                  <div id="gantt-chart-container">
                    <h4 className="text-center">{ganttChartTitle}</h4>
                    <br />
                    <GanttChart ref={ganttChartRef} />
                  </div>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal open={showModal} centered={true} hideModal={handleCloseModal}>
        <ModalHeader>
          <h5>Yeni Görev Ekle</h5>
        </ModalHeader>
        <ModalBody>
          <Form className="add-new-post">
            <FormInput
              required
              size="lg"
              className="mb-3"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              placeholder="Görev Başlığı"
            />

            <label htmlFor="startDate">Başlangıç Tarihi</label>
            <FormInput
              required
              id="startDate"
              type="date"
              size="lg"
              className="mb-3"
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />

            <label htmlFor="endDate">Bitiş Tarihi</label>
            <FormInput
              required
              id="endDate"
              type="date"
              size="lg"
              className="mb-3"
              onChange={(event) => {
                setEndDate(event.target.value);
              }}
            />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={handleCloseModal}>
            Kapat
          </Button>
          <Button theme="success" onClick={addTask}>
            Görev Ekle
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        open={showTaskModal}
        centered={true}
        size="lg"
        hideModal={handleCloseTaskModal}
      >
        <ModalHeader>
          <h5>Görev Silme İşlemi</h5>
        </ModalHeader>
        <ModalBody>
          <table className="table mb-0">
            <thead className="bg-light">
              <tr>
                <th scope="col" className="border-0">
                  #
                </th>
                <th scope="col" className="border-0">
                  Görev
                </th>
                <th scope="col" className="border-0">
                  Başlangıç
                </th>
                <th scope="col" className="border-0">
                  Bitiş
                </th>
                <th scope="col" className="border-0">
                  #
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{task.name}</td>
                    <td>{moment(task.start).format("DD MMMM YYYY")}</td>
                    <td>{moment(task.end).format("DD MMMM YYYY")}</td>
                    <td>
                      <Button
                        theme="danger"
                        disabled={tasks.length === 1 ? true : false}
                        onClick={() => {
                          ganttChartRef?.current?.removeTask(task.id);
                          handleCloseTaskModal();
                        }}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button theme="secondary" onClick={handleCloseTaskModal}>
            Kapat
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ProgressAddPage;
