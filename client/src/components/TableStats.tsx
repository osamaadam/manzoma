import { useQuery } from "@apollo/client";
import { Col, Row, Statistic } from "antd";
import { FC } from "react";
import { statsQuery } from "../graphql/stats.query";

interface Props {
  marhla: number;
  filteredSoldiers?: number;
  filteredRaft?: number;
  filteredMawkef?: number;
}

const TableStats: FC<Props> = ({
  marhla,
  filteredMawkef,
  filteredRaft,
  filteredSoldiers,
}) => {
  const { data } = useQuery<{
    stats: {
      totalSoldiers: number;
      totalRaft: number;
      totalMawkef: number;
    };
  }>(statsQuery, {
    variables: {
      marhla,
    },
  });

  return (
    <Row gutter={16} justify="space-between" align="middle">
      <Col>
        <Statistic
          title="جنود"
          suffix={` / ${data?.stats.totalSoldiers}`}
          value={filteredSoldiers}
        />
      </Col>
      <Col>
        <Statistic
          title="المواقف الطبية"
          suffix={` / ${data?.stats.totalMawkef}`}
          value={filteredMawkef}
        />
      </Col>
      <Col>
        <Statistic
          title="الرفت الطبي"
          suffix={` / ${data?.stats.totalRaft}`}
          value={filteredRaft}
        />
      </Col>
    </Row>
  );
};

export default TableStats;
