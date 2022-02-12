import { gql, GraphQLClient } from "graphql-request";

export class WarcraftLogsService {
    token: string;
    client: GraphQLClient;

    constructor(private accessToken: string) {
        this.token = accessToken;
    }
    async getReport(reportCode: string): Promise<any> {
        const reportQuery = gql`
            query getReportData(
                $reportCode: String!
                $dataType: TableDataType!
                $wipeCutoff: Int!
            ) {
                reportData {
                    report(code: $reportCode) {
                        code
                        title
                        startTime
                        endTime
                        fights {
                            id
                            name
                            startTime
                            endTime
                            bossPercentage
                            lastPhase
                            lastPhaseIsIntermission
                            encounterID
                        }
                        table(
                            dataType: $dataType
                            endTime: 31215065
                            wipeCutoff: $wipeCutoff
                        )
                    }
                }
            }
        `;

        const gqlClient = new GraphQLClient(
            "https://www.warcraftlogs.com/api/v2/user",
            {
                headers: {
                    authorization: `Bearer ${this.accessToken}`,
                },
            }
        );

        const variables = {
            reportCode,
            dataType: "Deaths",
            wipeCutoff: 2,
        };

        const data = await gqlClient.request(reportQuery, variables);

        const reportData = data.reportData.report;
        return reportData;
    }

    async getReportsForGuild(
        guildName: string = "Endure",
        realm: string = "zuljin",
        region: string = "us",
        zoneId: number = 28,
        limit: number = 50,
        page: number = 1
    ): Promise<any> {
        const reportQuery = gql`
            query getReports(
                $guildName: String!
                $realm: String!
                $region: String
                $limit: Int
                $page: Int
                $zoneId: Int
            ) {
                reportData {
                    reports(
                        guildName: $guildName
                        guildServerSlug: $realm
                        guildServerRegion: $region
                        limit: $limit
                        page: $page
                        zoneID: $zoneId
                    ) {
                        total
                        per_page
                        current_page
                        has_more_pages
                        last_page
                        data {
                            code
                            owner {
                                id
                                name
                            }
                            title
                            startTime
                            endTime
                            zone {
                                id
                                name
                            }
                            fights {
                                id
                                startTime
                                endTime
                                encounterID
                                bossPercentage
                            }
                        }
                    }
                }
            }
        `;

        const gqlClient = new GraphQLClient(
            "https://www.warcraftlogs.com/api/v2/user",
            {
                headers: {
                    authorization: `Bearer ${this.accessToken}`,
                },
            }
        );

        const variables = {
            guildName,
            realm,
            region,
            limit,
            page,
            zoneId: 28,
        };

        const data = await gqlClient.request(reportQuery, variables);
        // tslint:disable-next-line: no-console
        return data;
    }
}
