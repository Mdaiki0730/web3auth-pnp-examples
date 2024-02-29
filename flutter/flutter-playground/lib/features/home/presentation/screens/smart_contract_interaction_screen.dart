import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_playground/core/chain_provider.dart';
import 'package:flutter_playground/core/extensions.dart';
import 'package:flutter_playground/core/utils/strings.dart';
import 'package:flutter_playground/core/widgets/custom_dialog.dart';
import 'package:flutter_playground/features/home/domain/entities/chain_config.dart';
import 'package:flutter_playground/features/home/presentation/widgets/read_contract_view.dart';
import 'package:flutter_playground/features/home/presentation/widgets/write_contract_view.dart';
import 'package:web3dart/credentials.dart';

class SmartContractInteractionScreen extends StatefulWidget {
  final ChainConfig selectedChainConfig;

  const SmartContractInteractionScreen({
    super.key,
    required this.selectedChainConfig,
  });

  @override
  State<SmartContractInteractionScreen> createState() =>
      _SmartContractInteractionScreenState();
}

class _SmartContractInteractionScreenState
    extends State<SmartContractInteractionScreen> {
  late final ChainProvider chainProvider;
  late final TextEditingController contractAddressTextController;
  late final TextEditingController spenderAddressTextController;

  @override
  void initState() {
    super.initState();
    chainProvider = widget.selectedChainConfig.prepareChainProvider();
    contractAddressTextController = TextEditingController();
    spenderAddressTextController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text(StringConstants.appBarTitle),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                "Smart Contract Interactions",
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 24),
              const TabBar(
                indicatorSize: TabBarIndicatorSize.tab,
                tabs: [
                  Tab(text: "Read from Contract"),
                  Tab(text: "Write from Contract"),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: TabBarView(
                  children: [
                    ReadContractView(
                      contractAddressController: contractAddressTextController,
                      onFetchBalance: () {
                        _fetchBalance();
                      },
                      onTotalSupply: () {
                        _getTotalSupply();
                      },
                    ),
                    WriteContractView(
                      revokeApproval: () {
                        _revokeApproval();
                      },
                      contractAddressController: contractAddressTextController,
                      spenderAddressController: spenderAddressTextController,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _revokeApproval() async {
    try {
      showLoader(context);
      final result = await chainProvider.writeContract(
        contractAddressTextController.text,
        'approve',
        [
          EthereumAddress.fromHex('0xcEB7380d00A4750863a241BF74C7469f1C61F5F7'),
          BigInt.zero
        ],
      );
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, "Revoke Transaction Hash:\n\n$result");
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> _fetchBalance() async {
    try {
      showLoader(context);
      final result = await chainProvider.readContract(
        contractAddressTextController.text,
        'balanceOf',
        [EthereumAddress.fromHex('0xcEB7380d00A4750863a241BF74C7469f1C61F5F7')],
      );
      log(result.toString());
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, "Balance:\n\n${result.first}");
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }

  Future<void> _getTotalSupply() async {
    try {
      showLoader(context);
      final result = await chainProvider.readContract(
        contractAddressTextController.text,
        'totalSupply',
        [],
      );
      log(result.toString());
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, "Total Supply:\n\n${result.first}");
      }
    } catch (e, _) {
      log(e.toString(), stackTrace: _);
      if (context.mounted) {
        removeDialog(context);
        showInfoDialog(context, e.toString());
      }
    }
  }
}
