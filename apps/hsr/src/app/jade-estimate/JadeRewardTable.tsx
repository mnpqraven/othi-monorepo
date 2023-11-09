"use client";

import { AlertCircle } from "lucide-react";
import type { PlainMessage } from "@bufbuild/protobuf";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { JadeEstimateResponse } from "protocol/ts";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/primitive";
import { post } from "protocol/ts/jadeestimate-JadeEstimateService_connectquery";
import { estimateFormAtom } from "./_store/main";
import { placeholderTableData } from "./defaultTableData";

function JadeRewardTable() {
  const formPayload = useAtomValue(estimateFormAtom);
  const { data: rewardTable } = useQuery({
    ...post.useQuery(formPayload),
    placeholderData: keepPreviousData,
  });
  const data = rewardTable ?? placeholderTableData;

  return (
    <Table>
      <TableCaption>
        Breakdown of where you are getting Stellar Jades
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="flex items-center">
            Source
            <HoverCard openDelay={0}>
              <HoverCardTrigger>
                <AlertCircle className="hover:bg-accent hover:text-accent-foreground mx-1 scale-75 rounded-full align-text-bottom" />
              </HoverCardTrigger>
              <HoverCardContent className="w-96 text-justify" side="top">
                These are repeatable rewards that are guaranteed to you and does
                not include one-off rewards like events or redemption
                codes/promotions. You are bound to receive more than the table
                shows as you play the game.
              </HoverCardContent>
            </HoverCard>
          </TableHead>
          <TableHead>Recurring</TableHead>
          <TableHead>Jades</TableHead>
          <TableHead>Sp. Pass</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.sources.map((source) => (
          <TableRow key={source.source}>
            <TableCell>
              {!source.description ? (
                source.source
              ) : (
                <div className="inline-flex">
                  {source.source}
                  <HoverCard openDelay={0}>
                    <HoverCardTrigger className="inline-flex">
                      <AlertCircle className="hover:bg-accent hover:text-accent-foreground mx-1 scale-75 rounded-full align-text-bottom" />
                    </HoverCardTrigger>
                    <HoverCardContent side="top">
                      {source.description}
                    </HoverCardContent>
                  </HoverCard>
                </div>
              )}
            </TableCell>
            <TableCell>{source.sourceType}</TableCell>
            <TableCell>{source.jadesAmount}</TableCell>
            <TableCell>{source.rollsAmount}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="font-bold">
            Total {parseDayCount(data)}
          </TableCell>
          <TableCell />
          <TableCell className="font-bold">{data.totalJades}</TableCell>
          <TableCell className="font-bold">{data.rolls}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function parseDayCount(data: PlainMessage<JadeEstimateResponse> | undefined) {
  if (data) {
    if (data.days <= 1) return `(${data.days} day)`;
    return `(${data.days} days)`;
  }
  return `(0 day)`;
}

export default JadeRewardTable;
